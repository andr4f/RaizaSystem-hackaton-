package com.raiza.demo.tourism.service;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.service.ProductLotService;
import com.raiza.demo.shared.dto.FinanceLineItem;
import com.raiza.demo.shared.dto.FinanceSummaryResponse;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.LeadStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.ForbiddenException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.lead.dto.UpdateLeadStatusRequest;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lead.repository.PurchaseLeadRepository;
import com.raiza.demo.lead.service.PurchaseLeadService;
import com.raiza.demo.tourism.dto.CreateExperienceRequest;
import com.raiza.demo.tourism.dto.CreateTourismOperatorRequest;
import com.raiza.demo.tourism.dto.ExperienceLotResponse;
import com.raiza.demo.tourism.dto.ExperienceResponse;
import com.raiza.demo.tourism.dto.LinkExperienceLotRequest;
import com.raiza.demo.tourism.dto.TourismBookingResponse;
import com.raiza.demo.tourism.dto.TourismLeadResponse;
import com.raiza.demo.tourism.dto.TourismOperatorResponse;
import com.raiza.demo.tourism.dto.TourismVisitResponse;
import com.raiza.demo.traceability.entity.TraceEvent;
import com.raiza.demo.traceability.repository.TraceEventRepository;
import com.raiza.demo.tourism.entity.ExperienceLot;
import com.raiza.demo.tourism.entity.TourismExperience;
import com.raiza.demo.tourism.entity.TourismOperator;
import com.raiza.demo.tourism.mapper.TourismMapper;
import com.raiza.demo.tourism.repository.ExperienceLotRepository;
import com.raiza.demo.tourism.repository.TourismExperienceRepository;
import com.raiza.demo.tourism.repository.TourismOperatorRepository;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.EnumSet;
import java.util.HashMap;
import java.util.List;
import java.util.Locale;
import java.util.Map;
import java.util.Objects;
import java.util.Set;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TourismService {

    private static final Set<LeadStatus> BOOKING_STATUSES = EnumSet.of(
            LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.IN_EXPORT_REVIEW, LeadStatus.CLOSED_WON);
    private static final List<TraceEventType> VISIT_EVENT_TYPES = List.of(
            TraceEventType.QR_SCANNED, TraceEventType.LOT_RESERVED);

    private final TourismOperatorRepository tourismOperatorRepository;
    private final TourismExperienceRepository tourismExperienceRepository;
    private final ExperienceLotRepository experienceLotRepository;
    private final ProductLotService productLotService;
    private final TraceEventService traceEventService;
    private final TourismMapper tourismMapper;
    private final PurchaseLeadRepository purchaseLeadRepository;
    private final PurchaseLeadService purchaseLeadService;
    private final TraceEventRepository traceEventRepository;

    @Transactional(readOnly = true)
    public List<TourismOperatorResponse> findAllOperators() {
        return tourismOperatorRepository.findAll().stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional
    public TourismOperatorResponse createOperator(CreateTourismOperatorRequest request) {
        TourismOperator saved = tourismOperatorRepository.save(tourismMapper.toEntity(request));
        return tourismMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponse> findAllExperiences() {
        return tourismExperienceRepository.findAll().stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponse> findExperiencesByOperator(Long operatorId) {
        return tourismExperienceRepository.findByOperatorId(operatorId).stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExperienceResponse findExperienceById(Long id) {
        return tourismMapper.toResponse(getExperienceOrThrow(id));
    }

    @Transactional
    public ExperienceResponse createExperience(CreateExperienceRequest request) {
        TourismOperator operator = getOperatorOrThrow(request.operatorId());

        TourismExperience experience = new TourismExperience();
        experience.setOperator(operator);
        experience.setTitle(request.title());
        experience.setLocationName(request.locationName());
        experience.setDescription(request.description());
        experience.setQrSlug(resolveSlug(request.qrSlug(), request.title()));

        return tourismMapper.toResponse(tourismExperienceRepository.save(experience));
    }

    @Transactional(readOnly = true)
    public List<ExperienceLotResponse> findLotsForExperience(Long experienceId) {
        return experienceLotRepository.findByExperienceIdOrderByDisplayPriorityAsc(experienceId).stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional
    public ExperienceLotResponse linkLot(LinkExperienceLotRequest request) {
        TourismExperience experience = getExperienceOrThrow(request.experienceId());
        ProductLot lot = productLotService.getLotOrThrow(request.lotId());

        ExperienceLot link = new ExperienceLot();
        link.setExperience(experience);
        link.setLot(lot);
        link.setDisplayPriority(request.displayPriority() != null ? request.displayPriority() : 1);
        link.setNotes(request.notes());
        ExperienceLot saved = experienceLotRepository.save(link);

        traceEventService.record(lot, TraceEventType.TOURISM_LINKED, ActorType.TOURISM_OPERATOR,
                experience.getOperator().getId(),
                "Tourism experience linked: " + experience.getTitle(),
                "Lot " + lot.getLotCode() + " linked to tourism experience " + experience.getTitle());

        return tourismMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<TourismLeadResponse> findLeadsByOperator(Long operatorId) {
        OperatorContext ctx = resolveOperatorContext(operatorId);
        if (ctx.lotIds().isEmpty()) {
            return List.of();
        }
        return purchaseLeadRepository.findByLotIdInOrderByCreatedAtDesc(ctx.lotIds()).stream()
                .map(lead -> toLeadResponse(lead, ctx))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TourismVisitResponse> findVisitsByOperator(Long operatorId) {
        OperatorContext ctx = resolveOperatorContext(operatorId);
        if (ctx.lotIds().isEmpty()) {
            return List.of();
        }
        return traceEventRepository
                .findByLotIdsAndEventTypeInOrderByEventTimestampDesc(ctx.lotIds(), VISIT_EVENT_TYPES)
                .stream()
                .map(event -> toVisitResponse(event, ctx))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<TourismBookingResponse> findBookingsByOperator(Long operatorId) {
        OperatorContext ctx = resolveOperatorContext(operatorId);
        if (ctx.lotIds().isEmpty()) {
            return List.of();
        }
        return purchaseLeadRepository.findByLotIdInOrderByCreatedAtDesc(ctx.lotIds()).stream()
                .filter(lead -> BOOKING_STATUSES.contains(lead.getLeadStatus()))
                .map(lead -> toBookingResponse(lead, ctx))
                .toList();
    }

    @Transactional(readOnly = true)
    public FinanceSummaryResponse findFinanceByOperator(Long operatorId) {
        List<TourismBookingResponse> bookings = findBookingsByOperator(operatorId);
        List<TourismLeadResponse> leads = findLeadsByOperator(operatorId);

        long volume = bookings.stream()
                .map(TourismBookingResponse::requestedQuantity)
                .filter(Objects::nonNull)
                .mapToLong(BigDecimal::longValue)
                .sum();

        long active = bookings.stream()
                .filter(b -> b.status() != LeadStatus.CLOSED_WON && b.status() != LeadStatus.CLOSED_LOST)
                .count();
        long closed = bookings.stream().filter(b -> b.status() == LeadStatus.CLOSED_WON).count();
        long pending = leads.stream().filter(l -> l.leadStatus() == LeadStatus.NEW).count();

        List<FinanceLineItem> items = bookings.stream()
                .map(b -> new FinanceLineItem(
                        "booking",
                        b.visitorName(),
                        b.experienceTitle() + " · " + b.lotCode(),
                        b.requestedQuantity() != null ? b.requestedQuantity().longValue() : 0L,
                        b.status().name(),
                        b.createdAt()))
                .toList();

        return new FinanceSummaryResponse(volume, active, closed, pending, items);
    }

    @Transactional
    public TourismLeadResponse updateLeadStatus(Long operatorId, Long leadId, UpdateLeadStatusRequest request) {
        OperatorContext ctx = resolveOperatorContext(operatorId);
        if (!purchaseLeadService.isLeadOnLots(leadId, ctx.lotIds())) {
            throw new ForbiddenException("Lead does not belong to this tourism operator");
        }
        purchaseLeadService.updateStatus(leadId, request);
        return toLeadResponse(purchaseLeadService.getLeadOrThrow(leadId), ctx);
    }

    public void assertOperatorAccess(Long operatorId, Long profileId, boolean isAdmin) {
        if (!isAdmin && !operatorId.equals(profileId)) {
            throw new ForbiddenException("Access denied for this tourism operator");
        }
    }

    @Transactional(readOnly = true)
    public TourismOperator getOperatorOrThrow(Long id) {
        return tourismOperatorRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("TourismOperator", id));
    }

    @Transactional(readOnly = true)
    public TourismExperience getExperienceOrThrow(Long id) {
        return tourismExperienceRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("TourismExperience", id));
    }

    private String resolveSlug(String requested, String title) {
        String base = StringUtils.hasText(requested) ? requested : slugify(title);
        String slug = base;
        while (tourismExperienceRepository.findByQrSlug(slug).isPresent()) {
            slug = base + "-" + UUID.randomUUID().toString().substring(0, 6);
        }
        return slug;
    }

    private String slugify(String value) {
        String slug = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return StringUtils.hasText(slug) ? slug : "experience";
    }

    private OperatorContext resolveOperatorContext(Long operatorId) {
        List<TourismExperience> experiences = tourismExperienceRepository.findByOperatorId(operatorId);
        Map<Long, TourismExperience> lotExperienceMap = new HashMap<>();
        List<Long> lotIds = new ArrayList<>();
        for (TourismExperience experience : experiences) {
            experienceLotRepository.findByExperienceIdOrderByDisplayPriorityAsc(experience.getId())
                    .forEach(link -> {
                        if (link.getLot() != null) {
                            lotIds.add(link.getLot().getId());
                            lotExperienceMap.put(link.getLot().getId(), experience);
                        }
                    });
        }
        return new OperatorContext(lotIds, lotExperienceMap);
    }

    private TourismLeadResponse toLeadResponse(PurchaseLead lead, OperatorContext ctx) {
        TourismExperience experience = ctx.lotExperienceMap().get(lead.getLot().getId());
        return new TourismLeadResponse(
                lead.getId(),
                lead.getLot().getId(),
                lead.getLot().getLotCode(),
                experience != null ? experience.getId() : null,
                experience != null ? experience.getTitle() : null,
                lead.getBuyer().getId(),
                lead.getBuyer().getName(),
                lead.getBuyer().getBuyerType(),
                lead.getSourceType(),
                lead.getSourceReference(),
                lead.getRequestedQuantity(),
                lead.getUnitOfMeasure(),
                lead.getDestinationCountry(),
                lead.getMessage(),
                lead.getLeadStatus(),
                lead.getCreatedAt());
    }

    private TourismVisitResponse toVisitResponse(TraceEvent event, OperatorContext ctx) {
        ProductLot lot = event.getLot();
        TourismExperience experience = ctx.lotExperienceMap().get(lot.getId());
        String visitorName = resolveVisitorName(event);
        return new TourismVisitResponse(
                event.getId(),
                lot.getId(),
                lot.getLotCode(),
                experience != null ? experience.getId() : null,
                experience != null ? experience.getTitle() : null,
                event.getEventType(),
                event.getEventTimestamp(),
                event.getTitle(),
                event.getDescription(),
                visitorName);
    }

    private TourismBookingResponse toBookingResponse(PurchaseLead lead, OperatorContext ctx) {
        TourismExperience experience = ctx.lotExperienceMap().get(lead.getLot().getId());
        return new TourismBookingResponse(
                lead.getId(),
                lead.getId(),
                lead.getBuyer().getName(),
                experience != null ? experience.getTitle() : null,
                lead.getLot().getLotCode(),
                lead.getRequestedQuantity(),
                lead.getUnitOfMeasure(),
                lead.getLeadStatus(),
                lead.getCreatedAt(),
                lead.getMessage());
    }

    private String resolveVisitorName(TraceEvent event) {
        if (event.getActorType() != ActorType.BUYER || event.getActorId() == null) {
            return null;
        }
        return purchaseLeadRepository.findByLotId(event.getLot().getId()).stream()
                .filter(lead -> lead.getBuyer().getId().equals(event.getActorId()))
                .map(lead -> lead.getBuyer().getName())
                .findFirst()
                .orElse(null);
    }

    private record OperatorContext(List<Long> lotIds, Map<Long, TourismExperience> lotExperienceMap) {
    }
}
