package com.raiza.demo.farm.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreateFarmRequest(
        @NotNull Long producerId,
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 80) String municipality,
        @Size(max = 80) String corregimiento,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer altitudeMeters,
        BigDecimal areaHectares,
        @Size(max = 20) String connectivityLevel,
        String notes
) {
}
