package com.raiza.demo.publicview.dto;

import java.time.LocalDate;

public record PublicCertificationItem(
        String name,
        String issuer,
        String certificateCode,
        String status,
        LocalDate validFrom,
        LocalDate validTo
) {
}
