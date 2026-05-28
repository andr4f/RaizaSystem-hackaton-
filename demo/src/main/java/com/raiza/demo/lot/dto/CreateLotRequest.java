package com.raiza.demo.lot.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PositiveOrZero;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateLotRequest(
        @NotNull Long producerId,
        @NotNull Long farmId,
        @NotNull Long productId,
        LocalDate harvestDate,
        @NotNull @PositiveOrZero BigDecimal availableQuantity,
        @NotNull @Size(max = 20) String unitOfMeasure,
        @Size(max = 50) String processType,
        String cultivationConditions,
        @Size(max = 50) String qualityGrade
) {
}
