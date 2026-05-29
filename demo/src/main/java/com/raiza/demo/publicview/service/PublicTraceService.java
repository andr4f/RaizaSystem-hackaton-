package com.raiza.demo.publicview.service;

import com.raiza.demo.certification.entity.LotCertification;
import com.raiza.demo.certification.repository.LotCertificationRepository;
import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.repository.ProducerRepository;
import com.raiza.demo.product.entity.Product;
import com.raiza.demo.publicview.dto.PublicCertificationItem;
import com.raiza.demo.publicview.dto.PublicExperienceResponse;
import com.raiza.demo.publicview.dto.PublicProducerResponse;
import com.raiza.demo.publicview.dto.PublicTimelineEvent;
import com.raiza.demo.publicview.dto.PublicTraceResponse;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.tourism.entity.TourismExperience;
import com.raiza.demo.tourism.entity.TourismOperator;
import com.raiza.demo.tourism.repository.ExperienceLotRepository;
import com.raiza.demo.tourism.repository.TourismExperienceRepository;
import com.raiza.demo.traceability.entity.TraceEvent;
import com.raiza.demo.traceability.repository.TraceEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PublicTraceService {

    private final ProductLotRepository productLotRepository;
    private final LotCertificationRepository lotCertificationRepository;
    private final TraceEventRepository traceEventRepository;
    private final TourismExperienceRepository tourismExperienceRepository;
    private final ExperienceLotRepository experienceLotRepository;
    private final ProducerRepository producerRepository;

    @Transactional(readOnly = true)
    public PublicTraceResponse getByQrCode(String qrCodeValue) {
        ProductLot lot = productLotRepository.findByQrCodeValue(qrCodeValue)
                .orElseThrow(() -> ResourceNotFoundException.of("Lot QR", qrCodeValue));
        return buildTrace(lot);
    }

    @Transactional(readOnly = true)
    public PublicTraceResponse getByLotCode(String lotCode) {
        ProductLot lot = productLotRepository.findByLotCode(lotCode)
                .orElseThrow(() -> ResourceNotFoundException.of("Lot code", lotCode));
        return buildTrace(lot);
    }

    @Transactional(readOnly = true)
    public PublicProducerResponse getProducerById(Long producerId) {
        Producer producer = producerRepository.findById(producerId)
                .orElseThrow(() -> ResourceNotFoundException.of("Producer", producerId));
        return toProducerResponse(producer);
    }

    @Transactional(readOnly = true)
    public PublicExperienceResponse getExperienceBySlug(String qrSlug) {
        TourismExperience experience = tourismExperienceRepository.findByQrSlug(qrSlug)
                .orElseThrow(() -> ResourceNotFoundException.of("Experience", qrSlug));

        List<PublicTraceResponse> lots = experienceLotRepository
                .findByExperienceIdOrderByDisplayPriorityAsc(experience.getId()).stream()
                .map(link -> buildTrace(link.getLot()))
                .toList();

        TourismOperator operator = experience.getOperator();
        return new PublicExperienceResponse(
                experience.getQrSlug(),
                experience.getTitle(),
                experience.getLocationName(),
                experience.getDescription(),
                operator.getName(),
                operator.getOperatorType(),
                lots);
    }

    private PublicTraceResponse buildTrace(ProductLot lot) {
        Producer producer = lot.getProducer();
        Farm farm = lot.getFarm();
        Product product = lot.getProduct();

        List<PublicCertificationItem> certifications = lotCertificationRepository.findByLotId(lot.getId()).stream()
                .map(this::toCertificationItem)
                .toList();

        List<PublicTimelineEvent> timeline = traceEventRepository
                .findByLotIdOrderByEventTimestampAsc(lot.getId()).stream()
                .map(this::toTimelineEvent)
                .toList();

        return new PublicTraceResponse(
                lot.getId(),
                producer.getId(),
                lot.getLotCode(),
                lot.getQrCodeValue(),
                lot.getStatus(),
                product.getName(),
                product.getCategory(),
                product.getDescription(),
                producer.getName(),
                producer.getProducerType(),
                producer.getMunicipality(),
                producer.getCommunityName(),
                farm.getName(),
                farm.getMunicipality(),
                farm.getCorregimiento(),
                farm.getLatitude(),
                farm.getLongitude(),
                farm.getAltitudeMeters(),
                lot.getHarvestDate(),
                lot.getProcessType(),
                lot.getQualityGrade(),
                lot.getCultivationConditions(),
                certifications,
                timeline);
    }

    private PublicCertificationItem toCertificationItem(LotCertification link) {
        var cert = link.getCertification();
        return new PublicCertificationItem(
                cert.getName(),
                cert.getCertifier().toString(),
                link.getCertificateCode(),
                link.getStatus(),
                link.getValidFrom(),
                link.getValidTo());
    }

    private PublicTimelineEvent toTimelineEvent(TraceEvent event) {
        return new PublicTimelineEvent(
                event.getEventType(),
                event.getEventTimestamp(),
                event.getTitle(),
                event.getDescription(),
                event.getActorType(),
                event.getLatitude(),
                event.getLongitude(),
                event.getMetricName(),
                event.getMetricValue(),
                event.getMetricUnit(),
                event.getHashValue(),
                event.getPreviousHash());
    }

    private PublicProducerResponse toProducerResponse(Producer producer) {
        return new PublicProducerResponse(
                producer.getId(),
                producer.getName(),
                producer.getProducerType(),
                producer.getMunicipality(),
                producer.getDepartment(),
                producer.getCommunityName(),
                producer.getMainProduct(),
                producer.getBio());
    }
}
