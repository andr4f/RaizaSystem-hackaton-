package com.raiza.demo.tourism.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateTourismOperatorRequest(
        @NotBlank @Size(max = 150) String name,
        @NotBlank @Size(max = 50) String operatorType,
        @Size(max = 120) String contactName,
        @Size(max = 30) String phone,
        @Size(max = 120) String email,
        @Size(max = 80) String municipality,
        @Size(max = 200) String website,
        // Respuestas del onboarding
        @Size(max = 255) String experienceTypes,
        @Size(max = 20) String worksWithLocalProducers,
        @Size(max = 40) String monthlyVisitorsRange
) {
}
