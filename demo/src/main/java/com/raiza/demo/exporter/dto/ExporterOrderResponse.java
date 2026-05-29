package com.raiza.demo.exporter.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExporterOrderResponse(
        Long reviewId,
        Long leadId,
        String lotCode,
        String productName,
        String buyerName,
        String reviewStatus,
        String incoterm,
        LocalDate estimatedDeliveryDate,
        BigDecimal quantity,
        String unitOfMeasure,
        String destinationCountry,
        LocalDateTime createdAt,
        String notes
) {
}
