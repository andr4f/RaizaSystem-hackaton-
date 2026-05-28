package com.raiza.demo.exporter.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

public record ExporterReviewResponse(
        Long id,
        Long leadId,
        Long exporterId,
        String exporterName,
        String reviewStatus,
        String notes,
        LocalDate estimatedDeliveryDate,
        String incoterm,
        LocalDateTime createdAt
) {
}
