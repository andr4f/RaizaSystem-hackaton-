package com.raiza.demo.municipality.dto;

public record MunicipalityResponse(
        Long id,
        String name,
        String department,
        String subregion,
        String daneCode
) {}