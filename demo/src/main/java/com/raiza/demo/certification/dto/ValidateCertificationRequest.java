package com.raiza.demo.certification.dto;

import com.raiza.demo.shared.enums.CertificationValidationStatus;
import jakarta.validation.constraints.NotNull;

public record ValidateCertificationRequest(
        @NotNull(message = "Validation status is required")
        CertificationValidationStatus status,
        String notes
) {}
