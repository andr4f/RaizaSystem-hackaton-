package com.raiza.demo.tourism.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateExperienceRequest(
        @NotNull Long operatorId,
        @NotBlank @Size(max = 150) String title,
        @Size(max = 150) String locationName,
        String description,
        @Size(max = 120) String qrSlug
) {
}
