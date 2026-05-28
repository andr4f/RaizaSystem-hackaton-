package com.raiza.demo.lot.service;

import com.raiza.demo.certification.service.CertificationService;
import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.farm.service.FarmService;
import com.raiza.demo.lot.dto.CreateLotRequest;
import com.raiza.demo.lot.dto.LotDetailResponse;
import com.raiza.demo.lot.dto.LotResponse;
import com.raiza.demo.lot.dto.UpdateLotStatusRequest;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.mapper.LotMapper;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.product.entity.Product;
import com.raiza.demo.product.service.ProductService;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.BusinessRuleException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Year;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.ThreadLocalRandom;

@Service
@RequiredArgsConstructor
public class ProductLotService {

    private static final String CODE_ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

    private final ProductLotRepository productLotRepository;
    private final ProducerService producerService;
    private final FarmService farmService;
    private final ProductService productService;
    private final CertificationService certificationService;
    private final TraceEventService traceEventService;
    private final LotMapper lotMapper;

    @Transactional(readOnly = true)
    public List<LotResponse> findAll() {
        return productLotRepository.findAll().stream()
                .map(lotMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LotResponse> findByStatus(LotStatus status) {
        return productLotRepository.findByStatus(status).stream()
                .map(lotMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<LotResponse> findByProducer(Long producerId) {
        return productLotRepository.findByProducerId(producerId).stream()
                .map(lotMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public LotResponse findById(Long id) {
        return lotMapper.toResponse(getLotOrThrow(id));
    }

    @Transactional(readOnly = true)
    public LotDetailResponse getDetail(Long id) {
        ProductLot lot = getLotOrThrow(id);
        return lotMapper.toDetailResponse(lot,
                certificationService.findByLot(id),
                traceEventService.getTimeline(id));
    }

    @Transactional
    public LotResponse create(CreateLotRequest request) {
        Producer producer = producerService.getProducerOrThrow(request.producerId());
        Farm farm = farmService.getFarmOrThrow(request.farmId());
        Product product = productService.getProductOrThrow(request.productId());

        if (!farm.getProducer().getId().equals(producer.getId())) {
            throw new BusinessRuleException("Farm " + farm.getId() + " does not belong to producer " + producer.getId());
        }

        ProductLot lot = new ProductLot();
        lot.setLotCode(generateUniqueLotCode());
        lot.setProducer(producer);
        lot.setFarm(farm);
        lot.setProduct(product);
        lot.setHarvestDate(request.harvestDate());
        lot.setAvailableQuantity(request.availableQuantity());
        lot.setUnitOfMeasure(request.unitOfMeasure());
        lot.setProcessType(request.processType());
        lot.setCultivationConditions(request.cultivationConditions());
        lot.setQualityGrade(request.qualityGrade());
        lot.setStatus(LotStatus.AVAILABLE);
        lot.setQrCodeValue("qr-" + UUID.randomUUID().toString().replace("-", "").substring(0, 16));

        ProductLot saved = productLotRepository.save(lot);

        traceEventService.record(saved, TraceEventType.LOT_CREATED, ActorType.PRODUCER, producer.getId(),
                "Lot created: " + saved.getLotCode(),
                "Lot registered for product " + product.getName() + " at farm " + farm.getName());

        return lotMapper.toResponse(saved);
    }

    @Transactional
    public LotResponse changeStatus(Long id, UpdateLotStatusRequest request) {
        ProductLot lot = getLotOrThrow(id);
        LotStatus previous = lot.getStatus();
        lot.setStatus(request.status());
        ProductLot saved = productLotRepository.save(lot);

        if (request.status() == LotStatus.RESERVED && previous != LotStatus.RESERVED) {
            traceEventService.record(saved, TraceEventType.LOT_RESERVED, ActorType.ADMIN, null,
                    "Lot reserved: " + saved.getLotCode(),
                    request.note() != null ? request.note() : "Lot status changed to RESERVED");
        }

        return lotMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public ProductLot getLotOrThrow(Long id) {
        return productLotRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("ProductLot", id));
    }

    @Transactional(readOnly = true)
    public ProductLot getByQrCodeValue(String qrCodeValue) {
        return productLotRepository.findByQrCodeValue(qrCodeValue)
                .orElseThrow(() -> ResourceNotFoundException.of("ProductLot (qr)", qrCodeValue));
    }

    private String generateUniqueLotCode() {
        String year = String.valueOf(Year.now().getValue());
        String code;
        do {
            StringBuilder suffix = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                suffix.append(CODE_ALPHABET.charAt(ThreadLocalRandom.current().nextInt(CODE_ALPHABET.length())));
            }
            code = "MGD-" + year + "-" + suffix;
        } while (productLotRepository.existsByLotCode(code));
        return code;
    }
}
