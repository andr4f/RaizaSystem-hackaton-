package com.raiza.demo.finance.service;

import com.raiza.demo.exporter.entity.ExportReview;
import com.raiza.demo.exporter.repository.ExportReviewRepository;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lead.repository.PurchaseLeadRepository;
import com.raiza.demo.shared.dto.FinanceLineItem;
import com.raiza.demo.shared.dto.FinanceSummaryResponse;
import com.raiza.demo.shared.enums.LeadStatus;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.EnumSet;
import java.util.List;
import java.util.Objects;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class FinanceService {

    private static final Set<LeadStatus> ACTIVE = EnumSet.of(
            LeadStatus.NEW, LeadStatus.CONTACTED, LeadStatus.QUALIFIED, LeadStatus.IN_EXPORT_REVIEW);
    private static final Set<String> ACTIVE_REVIEWS = Set.of("PENDING_REVIEW", "UNDER_REVIEW");

    private final PurchaseLeadRepository purchaseLeadRepository;
    private final ExportReviewRepository exportReviewRepository;

    @Transactional(readOnly = true)
    public FinanceSummaryResponse forProducer(Long producerId) {
        List<PurchaseLead> leads = purchaseLeadRepository.findByLot_Producer_IdOrderByCreatedAtDesc(producerId);
        return buildFromLeads(leads, "lead");
    }

    @Transactional(readOnly = true)
    public FinanceSummaryResponse forExporter(Long exporterId) {
        List<PurchaseLead> leads = purchaseLeadRepository.findByExporterId(exporterId);
        List<ExportReview> reviews = exportReviewRepository.findByExporterId(exporterId);

        long volume = sumVolume(leads);
        long active = reviews.stream().filter(r -> ACTIVE_REVIEWS.contains(r.getReviewStatus())).count();
        long closed = leads.stream().filter(l -> l.getLeadStatus() == LeadStatus.CLOSED_WON).count();
        long pending = leads.stream().filter(l -> l.getLeadStatus() == LeadStatus.NEW).count();

        List<FinanceLineItem> items = reviews.stream()
                .map(review -> {
                    PurchaseLead lead = review.getLead();
                    return new FinanceLineItem(
                            "order",
                            lead.getBuyer().getName(),
                            lead.getLot().getLotCode() + " · " + review.getIncoterm(),
                            quantity(lead),
                            review.getReviewStatus(),
                            review.getCreatedAt());
                })
                .toList();

        return new FinanceSummaryResponse(volume, active, closed, pending, items);
    }

    private FinanceSummaryResponse buildFromLeads(List<PurchaseLead> leads, String category) {
        long volume = sumVolume(leads);
        long active = leads.stream().filter(l -> ACTIVE.contains(l.getLeadStatus())).count();
        long closed = leads.stream().filter(l -> l.getLeadStatus() == LeadStatus.CLOSED_WON).count();
        long pending = leads.stream().filter(l -> l.getLeadStatus() == LeadStatus.NEW).count();

        List<FinanceLineItem> items = leads.stream()
                .map(lead -> new FinanceLineItem(
                        category,
                        lead.getBuyer().getName(),
                        lead.getLot().getLotCode(),
                        quantity(lead),
                        lead.getLeadStatus().name(),
                        lead.getCreatedAt()))
                .toList();

        return new FinanceSummaryResponse(volume, active, closed, pending, items);
    }

    private long sumVolume(List<PurchaseLead> leads) {
        return leads.stream()
                .map(PurchaseLead::getRequestedQuantity)
                .filter(Objects::nonNull)
                .mapToLong(BigDecimal::longValue)
                .sum();
    }

    private long quantity(PurchaseLead lead) {
        return lead.getRequestedQuantity() != null ? lead.getRequestedQuantity().longValue() : 0L;
    }
}
