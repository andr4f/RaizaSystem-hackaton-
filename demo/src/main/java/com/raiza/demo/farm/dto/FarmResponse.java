package com.raiza.demo.farm.dto;

import java.math.BigDecimal;

public record FarmResponse(
        Long id,
        Long producerId,
        String producerName,
        String name,
        String municipality,
        String corregimiento,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer altitudeMeters,
        BigDecimal areaHectares,
        String connectivityLevel,
        String notes
) {
}
