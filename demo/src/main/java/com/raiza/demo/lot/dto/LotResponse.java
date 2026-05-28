package com.raiza.demo.lot.dto;

import com.raiza.demo.shared.enums.LotStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record LotResponse(
        Long id,
        String lotCode,
        Long producerId,
        String producerName,
        Long farmId,
        String farmName,
        Long productId,
        String productName,
        LocalDate harvestDate,
        BigDecimal availableQuantity,
        String unitOfMeasure,
        String processType,
        String qualityGrade,
        LotStatus status,
        String qrCodeValue,
        LocalDateTime createdAt
) {
}
