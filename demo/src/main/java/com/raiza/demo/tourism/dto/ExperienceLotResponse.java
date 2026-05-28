package com.raiza.demo.tourism.dto;

public record ExperienceLotResponse(
        Long id,
        Long experienceId,
        Long lotId,
        String lotCode,
        Integer displayPriority,
        String notes
) {
}
