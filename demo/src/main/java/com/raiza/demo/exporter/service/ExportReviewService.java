package com.raiza.demo.exporter.service;

import com.raiza.demo.exporter.dto.ExporterOrderResponse;
import com.raiza.demo.exporter.dto.ExporterReviewRequest;
import com.raiza.demo.exporter.dto.ExporterReviewResponse;
import com.raiza.demo.exporter.entity.ExportReview;
import com.raiza.demo.exporter.entity.ExportReview;
import com.raiza.demo.exporter.entity.Exporter;
import com.raiza.demo.exporter.mapper.ExporterMapper;
import com.raiza.demo.exporter.repository.ExportReviewRepository;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lead.service.PurchaseLeadService;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.LeadStatus;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExportReviewService {

    private final ExportReviewRepository exportReviewRepository;
    private final ExporterService exporterService;
    private final PurchaseLeadService purchaseLeadService;
    private final TraceEventService traceEventService;
    private final ExporterMapper exporterMapper;

    @Transactional(readOnly = true)
    public List<ExporterReviewResponse> findByLead(Long leadId) {
        return exportReviewRepository.findByLeadId(leadId).stream()
                .map(exporterMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExporterReviewResponse> findByExporter(Long exporterId) {
        return exportReviewRepository.findByExporterId(exporterId).stream()
                .map(exporterMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<ExporterOrderResponse> findOrdersByExporter(Long exporterId) {
        return exportReviewRepository.findByExporterId(exporterId).stream()
                .map(this::toOrderResponse)
                .toList();
    }

    private ExporterOrderResponse toOrderResponse(ExportReview review) {
        var lead = review.getLead();
        var lot = lead.getLot();
        String productName = lot.getProduct() != null ? lot.getProduct().getName() : null;
        return new ExporterOrderResponse(
                review.getId(),
                lead.getId(),
                lot.getLotCode(),
                productName,
                lead.getBuyer().getName(),
                review.getReviewStatus(),
                review.getIncoterm(),
                review.getEstimatedDeliveryDate(),
                lead.getRequestedQuantity(),
                lead.getUnitOfMeasure(),
                lead.getDestinationCountry(),
                review.getCreatedAt(),
                review.getNotes());
    }

    @Transactional
    public ExporterReviewResponse createReview(ExporterReviewRequest request) {
        PurchaseLead lead = purchaseLeadService.getLeadOrThrow(request.leadId());
        Exporter exporter = exporterService.getExporterOrThrow(request.exporterId());

        ExportReview review = new ExportReview();
        review.setLead(lead);
        review.setExporter(exporter);
        review.setReviewStatus(request.reviewStatus());
        review.setNotes(request.notes());
        review.setEstimatedDeliveryDate(request.estimatedDeliveryDate());
        review.setIncoterm(request.incoterm());
        ExportReview saved = exportReviewRepository.save(review);

        lead.setLeadStatus(LeadStatus.IN_EXPORT_REVIEW);

        ProductLot lot = lead.getLot();
        lot.setStatus(LotStatus.IN_EXPORT_REVIEW);

        traceEventService.record(lot, TraceEventType.EXPORT_REVIEWED, ActorType.EXPORTER, exporter.getId(),
                "Export review by " + exporter.getName(),
                "Exporter review status: " + request.reviewStatus());

        return exporterMapper.toResponse(saved);
    }
}
