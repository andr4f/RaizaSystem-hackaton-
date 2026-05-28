package com.raiza.demo.tourism.dto;

public record ExperienceResponse(
        Long id,
        Long operatorId,
        String operatorName,
        String title,
        String locationName,
        String description,
        String qrSlug
) {
}
