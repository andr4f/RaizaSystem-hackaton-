package com.raiza.demo.publicview.dto;

import com.raiza.demo.shared.enums.CertificationValidationStatus;

import java.time.LocalDate;

public record PublicCertificationItem(
        String name,
        String issuer,
        String certificateCode,
        CertificationValidationStatus status,
        LocalDate validFrom,
        LocalDate validTo
) {
}
