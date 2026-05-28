package com.raiza.demo.certification.dto;

import java.time.LocalDate;

public record CertificationResponse(
        Long id,
        Long farmId,
        String name,
        String certifier,
        String certificateNumber,
        LocalDate issuedAt,
        LocalDate expiresAt,
        String status,
        String verificationUrl
) {}
