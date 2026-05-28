package com.raiza.demo.exporter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record ExporterReviewRequest(
        @NotNull Long leadId,
        @NotNull Long exporterId,
        @NotBlank @Size(max = 30) String reviewStatus,
        String notes,
        LocalDate estimatedDeliveryDate,
        @Size(max = 20) String incoterm
) {
}
