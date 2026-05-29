package com.raiza.demo.tourism.dto;

import com.raiza.demo.shared.enums.BuyerType;
import com.raiza.demo.shared.enums.LeadStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TourismLeadResponse(
        Long id,
        Long lotId,
        String lotCode,
        Long experienceId,
        String experienceTitle,
        Long buyerId,
        String buyerName,
        BuyerType buyerType,
        String sourceType,
        String sourceReference,
        BigDecimal requestedQuantity,
        String unitOfMeasure,
        String destinationCountry,
        String message,
        LeadStatus leadStatus,
        LocalDateTime createdAt
) {
}
