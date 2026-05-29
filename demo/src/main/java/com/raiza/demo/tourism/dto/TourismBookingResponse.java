package com.raiza.demo.tourism.dto;

import com.raiza.demo.shared.enums.LeadStatus;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TourismBookingResponse(
        Long id,
        Long leadId,
        String visitorName,
        String experienceTitle,
        String lotCode,
        BigDecimal requestedQuantity,
        String unitOfMeasure,
        LeadStatus status,
        LocalDateTime createdAt,
        String message
) {
}
