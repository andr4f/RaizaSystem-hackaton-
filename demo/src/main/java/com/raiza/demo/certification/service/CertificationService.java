package com.raiza.demo.certification.service;

import com.raiza.demo.certification.dto.AttachCertificationRequest;
import com.raiza.demo.certification.dto.CertificationResponse;
import com.raiza.demo.certification.dto.CreateCertificationRequest;
import com.raiza.demo.certification.dto.LotCertificationResponse;
import com.raiza.demo.certification.entity.Certification;
import com.raiza.demo.certification.entity.LotCertification;
import com.raiza.demo.certification.mapper.CertificationMapper;
import com.raiza.demo.certification.repository.CertificationRepository;
import com.raiza.demo.certification.repository.LotCertificationRepository;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.CertificationValidationStatus;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.BusinessRuleException;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CertificationService {

    private final CertificationRepository certificationRepository;
    private final LotCertificationRepository lotCertificationRepository;
    private final ProductLotRepository productLotRepository;
    private final TraceEventService traceEventService;
    private final CertificationMapper certificationMapper;

    @Transactional(readOnly = true)
    public List<CertificationResponse> findAll() {
        return certificationRepository.findAll().stream()
                .map(certificationMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public CertificationResponse findById(Long id) {
        return certificationMapper.toResponse(getCertificationOrThrow(id));
    }

    @Transactional
    public CertificationResponse create(CreateCertificationRequest request) {
        certificationRepository.findByName(request.name()).ifPresent(existing -> {
            throw new DuplicateResourceException("Certification already exists: " + request.name());
        });
        Certification saved = certificationRepository.save(certificationMapper.toEntity(request));
        return certificationMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<LotCertificationResponse> findByLot(Long lotId) {
        return lotCertificationRepository.findByLotId(lotId).stream()
                .map(certificationMapper::toResponse)
                .toList();
    }

    @Transactional
    public LotCertificationResponse attachToLot(Long lotId, AttachCertificationRequest request) {
        ProductLot lot = productLotRepository.findById(lotId)
                .orElseThrow(() -> ResourceNotFoundException.of("ProductLot", lotId));
        Certification certification = getCertificationOrThrow(request.certificationId());

        boolean alreadyAttached = lotCertificationRepository
                .existsByLotIdAndCertificationId(lotId, request.certificationId());
        if (alreadyAttached) {
            throw new DuplicateResourceException(
                    "Certification " + certification.getName() + " already attached to lot " + lot.getLotCode());
        }

        LotCertification link = new LotCertification();
        link.setLot(lot);
        link.setCertification(certification);
        link.setCertificateCode(request.certificateCode());
        link.setValidFrom(request.validFrom());
        link.setValidTo(request.validTo());
        link.setStatus(CertificationValidationStatus.PENDING_VALIDATION);
        link.setEvidenceUrl(request.evidenceUrl());

        LotCertification saved = lotCertificationRepository.save(link);

        // Solo registra que se subió la evidencia, NO que está validada
        traceEventService.record(lot, TraceEventType.CERTIFICATION_VALIDATED, ActorType.PRODUCER, null,
                "Certification submitted: " + certification.getName(),
                "Evidence submitted for " + certification.getName() + " — pending validation");

        return certificationMapper.toResponse(saved);
    }

    @Transactional
    public LotCertificationResponse validateCertification(Long lotCertificationId, Long adminId,
                                                          CertificationValidationStatus newStatus,
                                                          String notes) {
        LotCertification link = lotCertificationRepository.findById(lotCertificationId)
                .orElseThrow(() -> ResourceNotFoundException.of("LotCertification", lotCertificationId));

        if (link.getStatus() == CertificationValidationStatus.VALIDATED) {
            throw new BusinessRuleException("Certification is already validated");
        }

        link.setStatus(newStatus);
        link.setValidationNotes(notes);
        link.setValidatedBy(adminId);
        link.setValidatedAt(LocalDateTime.now());

        LotCertification saved = lotCertificationRepository.save(link);
        ProductLot lot = saved.getLot();

        if (newStatus == CertificationValidationStatus.VALIDATED
                || newStatus == CertificationValidationStatus.CONDITIONALLY_VALID) {

            traceEventService.record(lot, TraceEventType.CERTIFICATION_VALIDATED, ActorType.ADMIN, adminId,
                    "Certification validated: " + saved.getCertification().getName(),
                    "Status: " + newStatus.name() + (notes != null ? " — " + notes : ""));

            // Si el lote estaba pendiente, ahora pasa a AVAILABLE (exportable)
            if (lot.getStatus() == LotStatus.CERTIFICATION_PENDING) {
                lot.setStatus(LotStatus.AVAILABLE);
                productLotRepository.save(lot);
            }
        }

        return certificationMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Certification getCertificationOrThrow(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Certification", id));
    }
}
