package com.raiza.demo.certification.dto;

import com.raiza.demo.shared.enums.CertificationApplicationStatus;

import java.time.LocalDateTime;

public record CertificationApplicationResponse(
        Long id,
        String applicationCode,
        CertificationApplicationStatus status,

        // Datos del lote y productor (resumen)
        String certificationName,
        String producerName,
        String farmName,
        String lotCode,
        String productName,

        Boolean recommendedByAi,
        LocalDateTime submittedAt,

        // URL para descargar el PDF generado
        String pdfDownloadUrl
) {}
