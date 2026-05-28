package com.raiza.demo.certification.dto;

import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record AttachCertificationRequest(
        @NotNull Long certificationId,
        String certificateCode,
        LocalDate validFrom,
        LocalDate validTo,
        String status,
        String evidenceUrl
) {
}
