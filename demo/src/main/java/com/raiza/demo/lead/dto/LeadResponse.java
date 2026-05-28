package com.raiza.demo.lead.dto;

import com.raiza.demo.shared.enums.BuyerType;
import com.raiza.demo.shared.enums.LeadStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record LeadResponse(
        Long id,
        Long lotId,
        String lotCode,
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
