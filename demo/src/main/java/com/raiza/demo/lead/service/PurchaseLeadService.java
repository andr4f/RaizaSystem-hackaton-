package com.raiza.demo.lead.service;

import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.buyer.service.BuyerService;
import com.raiza.demo.lead.dto.CreatePublicLeadRequest;
import com.raiza.demo.lead.dto.LeadResponse;
import com.raiza.demo.lead.dto.UpdateLeadStatusRequest;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lead.mapper.LeadMapper;
import com.raiza.demo.lead.repository.PurchaseLeadRepository;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.service.ProductLotService;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.BuyerType;
import com.raiza.demo.shared.enums.LeadStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PurchaseLeadService {

    private static final String DEFAULT_SOURCE_TYPE = "PUBLIC_QR";

    private final PurchaseLeadRepository purchaseLeadRepository;
    private final ProductLotService productLotService;
    private final BuyerService buyerService;
    private final TraceEventService traceEventService;
    private final LeadMapper leadMapper;

    @Transactional(readOnly = true)
    public List<LeadResponse> findAll() {
        return purchaseLeadRepository.findAllByOrderByCreatedAtDesc().stream()
                .map(leadMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LeadResponse findById(Long id) {
        return leadMapper.toResponse(getLeadOrThrow(id));
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> findByStatus(LeadStatus status) {
        return purchaseLeadRepository.findByLeadStatus(status).stream()
                .map(leadMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> findByLot(Long lotId) {
        return purchaseLeadRepository.findByLotId(lotId).stream()
                .map(leadMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> findByProducer(Long producerId) {
        return purchaseLeadRepository.findByLot_Producer_IdOrderByCreatedAtDesc(producerId).stream()
                .map(leadMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> findByExporter(Long exporterId) {
        return purchaseLeadRepository.findByExporterId(exporterId).stream()
                .map(leadMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LeadResponse> findByLotIds(List<Long> lotIds) {
        if (lotIds == null || lotIds.isEmpty()) {
            return List.of();
        }
        return purchaseLeadRepository.findByLotIdInOrderByCreatedAtDesc(lotIds).stream()
                .map(leadMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public boolean isLeadOnLots(Long leadId, List<Long> lotIds) {
        if (lotIds == null || lotIds.isEmpty()) {
            return false;
        }
        PurchaseLead lead = getLeadOrThrow(leadId);
        return lead.getLot() != null && lotIds.contains(lead.getLot().getId());
    }

    @Transactional
    public LeadResponse createPublicLead(CreatePublicLeadRequest request) {
        ProductLot lot = productLotService.getLotOrThrow(request.lotId());
        Buyer buyer = buyerService.findOrCreate(
                request.buyerType(), request.buyerName(), request.companyName(), request.country(),
                request.phone(), request.email(), request.preferredLanguage());

        PurchaseLead lead = new PurchaseLead();
        lead.setLot(lot);
        lead.setBuyer(buyer);
        lead.setSourceType(StringUtils.hasText(request.sourceType()) ? request.sourceType() : DEFAULT_SOURCE_TYPE);
        lead.setSourceReference(request.sourceReference());
        lead.setRequestedQuantity(request.requestedQuantity());
        lead.setUnitOfMeasure(request.unitOfMeasure());
        lead.setDestinationCountry(request.destinationCountry());
        lead.setMessage(request.message());
        lead.setLeadStatus(isCommercialBuyer(request.buyerType()) ? LeadStatus.IN_EXPORT_REVIEW : LeadStatus.NEW);
        PurchaseLead saved = purchaseLeadRepository.save(lead);

        traceEventService.record(lot, TraceEventType.PURCHASE_INTENT_CREATED, ActorType.BUYER, buyer.getId(),
                "Purchase intent created by " + buyer.getName(),
                "Buyer expressed purchase interest for lot " + lot.getLotCode());

        return leadMapper.toResponse(saved);
    }

    @Transactional
    public LeadResponse updateStatus(Long id, UpdateLeadStatusRequest request) {
        PurchaseLead lead = getLeadOrThrow(id);
        lead.setLeadStatus(request.leadStatus());
        return leadMapper.toResponse(purchaseLeadRepository.save(lead));
    }

    @Transactional(readOnly = true)
    public PurchaseLead getLeadOrThrow(Long id) {
        return purchaseLeadRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("PurchaseLead", id));
    }

    private boolean isCommercialBuyer(BuyerType buyerType) {
        return buyerType == BuyerType.IMPORTER
                || buyerType == BuyerType.ROASTER
                || buyerType == BuyerType.DISTRIBUTOR
                || buyerType == BuyerType.HOTEL;
    }
}
