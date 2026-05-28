package com.raiza.demo.certification.service;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.raiza.demo.certification.dto.CertificationApplicationPayload;
import com.raiza.demo.certification.dto.CertificationApplicationRequest;
import com.raiza.demo.certification.dto.CertificationApplicationResponse;
import com.raiza.demo.certification.entity.Certification;
import com.raiza.demo.certification.entity.CertificationApplication;
import com.raiza.demo.certification.repository.CertificationApplicationRepository;
import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.farm.service.FarmService;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.service.ProductLotService;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.shared.enums.CertificationApplicationStatus;
import com.raiza.demo.shared.exception.BusinessRuleException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class CertificationApplicationService {

    private final CertificationApplicationRepository applicationRepository;
    private final CertificationService certificationService;
    private final ProducerService producerService;
    private final FarmService farmService;
    private final ProductLotService lotService;
    private final CertificationPdfService pdfService;
    private final ObjectMapper objectMapper;

    @Transactional
    public CertificationApplicationResponse submit(CertificationApplicationRequest request) {
        // 1. Cargar entidades desde la BD
        Producer producer   = producerService.getProducerOrThrow(request.producerId());
        Farm farm           = farmService.getFarmOrThrow(request.farmId());
        ProductLot lot      = lotService.getLotOrThrow(request.lotId());
        Certification cert  = certificationService.getCertificationOrThrow(request.certificationId());

        // 2. Validaciones de negocio
        if (!farm.getProducer().getId().equals(producer.getId())) {
            throw new BusinessRuleException("Farm does not belong to producer");
        }
        if (!lot.getProducer().getId().equals(producer.getId())) {
            throw new BusinessRuleException("Lot does not belong to producer");
        }
        if (applicationRepository.existsByLotIdAndCertificationId(lot.getId(), cert.getId())) {
            throw new BusinessRuleException(
                    "An application for " + cert.getName() + " already exists for lot " + lot.getLotCode());
        }

        // 3. Construir el payload completo (snapshot para PDF y auditoría)
        String applicationCode = generateApplicationCode();
        CertificationApplicationPayload payload = buildPayload(request, producer, farm, lot, cert, applicationCode);

        // 4. Serializar payload a JSON
        String payloadJson = toJson(payload);

        // 5. Generar el PDF desde el payload
        byte[] pdfBytes = pdfService.generate(payload);
        String pdfPath  = pdfService.store(pdfBytes, applicationCode);

        // 6. Persistir la solicitud
        CertificationApplication application = new CertificationApplication();
        application.setApplicationCode(applicationCode);
        application.setProducer(producer);
        application.setFarm(farm);
        application.setLot(lot);
        application.setCertification(cert);
        application.setStatus(CertificationApplicationStatus.SUBMITTED);
        application.setPayloadJson(payloadJson);
        application.setPdfPath(pdfPath);
        application.setDestinationEmail(request.destinationEmail());
        application.setRecommendedByAi(request.recommendedByAi());

        CertificationApplication saved = applicationRepository.save(application);

        return toResponse(saved, producer, farm, lot, cert);
    }

    @Transactional(readOnly = true)
    public List<CertificationApplicationResponse> findByProducer(Long producerId) {
        return applicationRepository.findByProducerId(producerId).stream()
                .map(a -> toResponse(a, a.getProducer(), a.getFarm(), a.getLot(), a.getCertification()))
                .toList();
    }

    @Transactional(readOnly = true)
    public List<CertificationApplicationResponse> findByStatus(CertificationApplicationStatus status) {
        return applicationRepository.findByStatus(status).stream()
                .map(a -> toResponse(a, a.getProducer(), a.getFarm(), a.getLot(), a.getCertification()))
                .toList();
    }

    // ── Regenerar PDF desde el JSON almacenado ────────────────────────────
    @Transactional(readOnly = true)
    public byte[] regeneratePdf(Long applicationId) {
        CertificationApplication app = applicationRepository.findById(applicationId)
                .orElseThrow(() -> ResourceNotFoundException.of("CertificationApplication", applicationId));
        CertificationApplicationPayload payload = fromJson(app.getPayloadJson());
        return pdfService.generate(payload);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private CertificationApplicationPayload buildPayload(
            CertificationApplicationRequest req,
            Producer producer, Farm farm, ProductLot lot, Certification cert,
            String applicationCode) {

        return new CertificationApplicationPayload(
                // Bloque 1 — Productor
                producer.getId(),
                producer.getName(),
                producer.getDocumentType(),
                producer.getDocumentNumber(),
                producer.getProducerType() != null ? producer.getProducerType().name() : null,
                producer.getPhone(),
                producer.getEmail(),
                producer.getMunicipality(),
                producer.getDepartment(),
                producer.getCommunityName(),
                req.isCooperativeMember(),
                req.associationName(),
                // Bloque 2 — Finca
                farm.getId(),
                farm.getName(),
                farm.getMunicipality(),
                farm.getCorregimiento(),
                farm.getLatitude(),
                farm.getLongitude(),
                farm.getAltitudeMeters(),
                farm.getAreaHectares(),
                farm.getConnectivityLevel(),
                // Bloque 3 — Lote y producto
                lot.getId(),
                lot.getLotCode(),
                lot.getProduct().getId(),
                lot.getProduct().getName(),
                lot.getProduct().getCategory(),
                lot.getHarvestDate(),
                req.estimatedVolume() != null ? req.estimatedVolume() : lot.getAvailableQuantity(),
                req.volumeUnit()     != null ? req.volumeUnit()     : lot.getUnitOfMeasure(),
                req.cultivationType(),
                lot.getCultivationConditions(),
                lot.getQualityGrade(),
                lot.getProcessType(),
                // Bloque 4 — Certificación
                cert.getId(),
                cert.getName(),
                cert.getIssuer(),
                req.producerAnswers(),
                req.recommendedByAi(),
                req.missingRequirements(),
                // Metadatos
                applicationCode,
                LocalDateTime.now(),
                req.destinationEmail()
        );
    }

    private CertificationApplicationResponse toResponse(
            CertificationApplication app,
            Producer producer, Farm farm, ProductLot lot, Certification cert) {
        return new CertificationApplicationResponse(
                app.getId(),
                app.getApplicationCode(),
                app.getStatus(),
                cert.getName(),
                producer.getName(),
                farm.getName(),
                lot.getLotCode(),
                lot.getProduct().getName(),
                app.getRecommendedByAi(),
                app.getCreatedAt(),
                "/api/v1/certification-applications/" + app.getId() + "/pdf"
        );
    }

    private String generateApplicationCode() {
        return "CERT-APP-" + UUID.randomUUID().toString().replace("-", "").substring(0, 10).toUpperCase();
    }

    private String toJson(CertificationApplicationPayload payload) {
        try {
            return objectMapper.writeValueAsString(payload);
        } catch (JsonProcessingException e) {
            throw new RuntimeException("Failed to serialize payload", e);
        }
    }

    private CertificationApplicationPayload fromJson(String json) {
        try {
            return objectMapper.readValue(json, CertificationApplicationPayload.class);
        } catch (Exception e) {
            throw new RuntimeException("Failed to deserialize payload", e);
        }
    }
}
