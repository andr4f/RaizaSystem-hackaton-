package com.raiza.demo.lot.dto;

import com.raiza.demo.certification.dto.LotCertificationResponse;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.traceability.dto.TraceEventResponse;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record LotDetailResponse(
        Long id,
        String lotCode,
        Long producerId,
        String producerName,
        Long farmId,
        String farmName,
        Long productId,
        String productName,
        String productCategory,
        LocalDate harvestDate,
        BigDecimal availableQuantity,
        String unitOfMeasure,
        String processType,
        String cultivationConditions,
        String qualityGrade,
        LotStatus status,
        String blockchainReference,
        String qrCodeValue,
        LocalDateTime createdAt,
        List<LotCertificationResponse> certifications,
        List<TraceEventResponse> events
) {
}
