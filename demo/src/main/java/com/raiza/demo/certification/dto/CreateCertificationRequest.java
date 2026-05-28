package com.raiza.demo.certification.dto;

import com.raiza.demo.certification.enums.Certifier;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record CreateCertificationRequest(
        @NotNull Long farmId,
        @NotBlank @Size(max = 150) String name,
        @NotNull Certifier certifier,
        @NotBlank @Size(max = 100) String certificateNumber,
        @NotNull LocalDate issuedAt,
        LocalDate expiresAt,
        @Size(max = 500) String verificationUrl
) {}
