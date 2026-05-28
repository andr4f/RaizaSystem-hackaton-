package com.raiza.demo.certification.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateCertificationRequest(
        @NotBlank @Size(max = 100) String name,
        @Size(max = 120) String issuer,
        String description
) {
}
