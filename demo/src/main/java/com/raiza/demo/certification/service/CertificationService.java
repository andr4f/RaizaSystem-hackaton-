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
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

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

        LotCertification link = new LotCertification();
        link.setLot(lot);
        link.setCertification(certification);
        link.setCertificateCode(request.certificateCode());
        link.setValidFrom(request.validFrom());
        link.setValidTo(request.validTo());
        link.setStatus(request.status());
        link.setEvidenceUrl(request.evidenceUrl());
        LotCertification saved = lotCertificationRepository.save(link);

        traceEventService.record(lot, TraceEventType.CERTIFICATION_VALIDATED, ActorType.ADMIN, null,
                "Certification validated: " + certification.getName(),
                "Certification " + certification.getName() + " linked to lot " + lot.getLotCode());

        return certificationMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Certification getCertificationOrThrow(Long id) {
        return certificationRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Certification", id));
    }
}
