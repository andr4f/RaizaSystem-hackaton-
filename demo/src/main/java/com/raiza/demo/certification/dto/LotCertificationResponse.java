package com.raiza.demo.certification.dto;

import java.time.LocalDate;

public record LotCertificationResponse(
        Long id,
        Long lotId,
        Long certificationId,
        String certificationName,
        String certificateCode,
        LocalDate validFrom,
        LocalDate validTo,
        String status,
        String evidenceUrl
) {
}
