package com.raiza.demo.dashboard.service;

import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.certification.repository.CertificationApplicationRepository;
import com.raiza.demo.certification.repository.LotCertificationRepository;
import com.raiza.demo.dashboard.dto.DashboardStatsResponse;
import com.raiza.demo.dashboard.dto.TimeSeriesPoint;
import com.raiza.demo.exporter.entity.ExportReview;
import com.raiza.demo.exporter.repository.ExportReviewRepository;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lead.repository.PurchaseLeadRepository;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.enums.CertificationApplicationStatus;
import com.raiza.demo.shared.enums.LeadStatus;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.traceability.repository.TraceEventRepository;
import com.raiza.demo.tourism.entity.ExperienceLot;
import com.raiza.demo.tourism.entity.TourismExperience;
import com.raiza.demo.tourism.repository.ExperienceLotRepository;
import com.raiza.demo.tourism.repository.TourismExperienceRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.EnumSet;
import java.util.List;
import java.util.Locale;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private static final Set<LotStatus> ACTIVE_LOT_STATUSES = EnumSet.of(
            LotStatus.AVAILABLE, LotStatus.CERTIFICATION_PENDING, LotStatus.RESERVED);
    private static final Set<LotStatus> VERIFIED_LOT_STATUSES = EnumSet.of(
            LotStatus.AVAILABLE, LotStatus.RESERVED, LotStatus.IN_EXPORT_REVIEW, LotStatus.SOLD);
    private static final Set<LeadStatus> OPEN_LEAD_STATUSES = EnumSet.of(
            LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.IN_EXPORT_REVIEW);
    private static final Set<LeadStatus> BOOKING_STATUSES = EnumSet.of(
            LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.IN_EXPORT_REVIEW, LeadStatus.CLOSED_WON);
    private static final Set<String> ACTIVE_REVIEW_STATUSES = Set.of("PENDING_REVIEW", "UNDER_REVIEW");

    private final ProductLotRepository productLotRepository;
    private final TraceEventRepository traceEventRepository;
    private final LotCertificationRepository lotCertificationRepository;
    private final CertificationApplicationRepository certificationApplicationRepository;
    private final PurchaseLeadRepository purchaseLeadRepository;
    private final ExportReviewRepository exportReviewRepository;
    private final TourismExperienceRepository tourismExperienceRepository;
    private final ExperienceLotRepository experienceLotRepository;

    @Transactional(readOnly = true)
    public DashboardStatsResponse getStats(AppUser user) {
        if (user.getProfileId() == null) {
            return DashboardStatsResponse.empty();
        }
        return switch (user.getRole()) {
            case PRODUCER -> producerStats(user.getProfileId());
            case EXPORTER -> exporterStats(user.getProfileId());
            case TOURISM_OPERATOR -> tourismStats(user.getProfileId());
            default -> DashboardStatsResponse.empty();
        };
    }

    private DashboardStatsResponse producerStats(Long producerId) {
        List<ProductLot> lots = productLotRepository.findByProducerId(producerId);
        long activeLots = lots.stream().filter(l -> ACTIVE_LOT_STATUSES.contains(l.getStatus())).count();

        LocalDateTime monthStart = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime nextMonth = monthStart.plusMonths(1);
        LocalDateTime prevMonthStart = monthStart.minusMonths(1);

        long qrThisMonth = traceEventRepository.countByProducerIdAndEventTypeBetween(
                producerId, TraceEventType.QR_SCANNED, monthStart, nextMonth);
        long qrPrevMonth = traceEventRepository.countByProducerIdAndEventTypeBetween(
                producerId, TraceEventType.QR_SCANNED, prevMonthStart, monthStart);
        long qrTotal = traceEventRepository.countByProducerIdAndEventType(
                producerId, TraceEventType.QR_SCANNED);

        long validatedCerts = lotCertificationRepository.countByLot_Producer_IdAndStatus(
                producerId, com.raiza.demo.shared.enums.CertificationValidationStatus.VALIDATED);
        long approvedApps = certificationApplicationRepository.countByProducerIdAndStatus(
                producerId, CertificationApplicationStatus.APPROVED);
        long certifications = validatedCerts + approvedApps;

        long opportunities = purchaseLeadRepository.findByLot_Producer_IdOrderByCreatedAtDesc(producerId).stream()
                .filter(l -> OPEN_LEAD_STATUSES.contains(l.getLeadStatus()))
                .count();

        List<TimeSeriesPoint> series = buildMonthlySeries(
                traceEventRepository.countMonthlyByProducerAndEventType(
                        producerId, TraceEventType.QR_SCANNED.name(), monthStart.minusMonths(5)));

        return new DashboardStatsResponse(
                activeLots, qrTotal, qrThisMonth, certifications, opportunities,
                null, null, null, null, null, null, null, null, null,
                trendPct(qrThisMonth, qrPrevMonth), null, series);
    }

    private DashboardStatsResponse exporterStats(Long exporterId) {
        List<ExportReview> reviews = exportReviewRepository.findByExporterId(exporterId);
        List<PurchaseLead> leads = reviews.stream()
                .map(ExportReview::getLead)
                .filter(Objects::nonNull)
                .distinct()
                .toList();

        long verifiedLots = leads.stream()
                .map(PurchaseLead::getLot)
                .filter(Objects::nonNull)
                .filter(l -> VERIFIED_LOT_STATUSES.contains(l.getStatus()))
                .map(ProductLot::getId)
                .distinct()
                .count();

        long opportunities = leads.stream()
                .filter(l -> OPEN_LEAD_STATUSES.contains(l.getLeadStatus()))
                .count();

        long orders = reviews.stream()
                .filter(r -> ACTIVE_REVIEW_STATUSES.contains(r.getReviewStatus()))
                .count();

        long volume = leads.stream()
                .map(PurchaseLead::getRequestedQuantity)
                .filter(Objects::nonNull)
                .mapToLong(BigDecimal::longValue)
                .sum();

        List<TimeSeriesPoint> series = buildMonthlySeries(
                traceEventRepository.countMonthlyByExporterAndEventType(
                        exporterId, TraceEventType.EXPORT_REVIEWED.name(),
                        YearMonth.now().atDay(1).atStartOfDay().minusMonths(5)));

        return new DashboardStatsResponse(
                null, null, null, null, opportunities,
                verifiedLots, orders, volume, null, null, null, null, null, null,
                null, null, series);
    }

    private DashboardStatsResponse tourismStats(Long operatorId) {
        List<TourismExperience> experiences = tourismExperienceRepository.findByOperatorId(operatorId);
        List<Long> lotIds = experiences.stream()
                .flatMap(e -> experienceLotRepository.findByExperienceIdOrderByDisplayPriorityAsc(e.getId()).stream())
                .map(ExperienceLot::getLot)
                .filter(Objects::nonNull)
                .map(ProductLot::getId)
                .distinct()
                .toList();

        LocalDateTime monthStart = YearMonth.now().atDay(1).atStartOfDay();
        LocalDateTime nextMonth = monthStart.plusMonths(1);
        LocalDateTime prevMonthStart = monthStart.minusMonths(1);

        long visitsThisMonth = lotIds.isEmpty() ? 0L : traceEventRepository.countByLotIdsAndEventTypeBetween(
                lotIds, TraceEventType.QR_SCANNED, monthStart, nextMonth);
        long visitsPrevMonth = lotIds.isEmpty() ? 0L : traceEventRepository.countByLotIdsAndEventTypeBetween(
                lotIds, TraceEventType.QR_SCANNED, prevMonthStart, monthStart);
        long visitsTotal = lotIds.isEmpty() ? 0L : traceEventRepository.countByLotIdsAndEventType(
                lotIds, TraceEventType.QR_SCANNED);

        long bookings = lotIds.isEmpty() ? 0L : purchaseLeadRepository.findByLotIdIn(lotIds).stream()
                .filter(l -> BOOKING_STATUSES.contains(l.getLeadStatus()))
                .count();

        long allies = lotIds.isEmpty() ? 0L : productLotRepository.findAllById(lotIds).stream()
                .map(l -> l.getProducer().getId())
                .filter(Objects::nonNull)
                .distinct()
                .count();

        List<TimeSeriesPoint> series = lotIds.isEmpty()
                ? List.of()
                : buildMonthlySeries(traceEventRepository.countMonthlyByLotIdsAndEventType(
                        lotIds, TraceEventType.QR_SCANNED.name(), monthStart.minusMonths(5)));

        return new DashboardStatsResponse(
                null, null, null, null, null,
                null, null, null,
                (long) experiences.size(), visitsTotal, visitsThisMonth, bookings, allies, (long) lotIds.size(),
                null, trendPct(visitsThisMonth, visitsPrevMonth), series);
    }

    private List<TimeSeriesPoint> buildMonthlySeries(List<Object[]> rows) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("MMM", new Locale("es", "CO"));
        return rows.stream()
                .map(row -> {
                    String ym = String.valueOf(row[0]);
                    YearMonth yearMonth = YearMonth.parse(ym);
                    String label = yearMonth.atDay(1).format(fmt);
                    long value = ((Number) row[1]).longValue();
                    return new TimeSeriesPoint(label, value);
                })
                .toList();
    }

    private Double trendPct(long current, long previous) {
        if (previous == 0) {
            return current > 0 ? 100.0 : 0.0;
        }
        return Math.round(((current - previous) * 1000.0 / previous)) / 10.0;
    }
}
