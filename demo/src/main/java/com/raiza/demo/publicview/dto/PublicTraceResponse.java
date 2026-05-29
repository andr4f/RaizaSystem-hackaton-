package com.raiza.demo.publicview.dto;

import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.enums.ProducerType;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record PublicTraceResponse(
        Long lotId,
        Long producerId,
        String lotCode,
        String qrCodeValue,
        LotStatus status,
        String productName,
        String productCategory,
        String productDescription,
        String producerName,
        ProducerType producerType,
        String producerMunicipality,
        String communityName,
        String farmName,
        String farmMunicipality,
        String corregimiento,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer altitudeMeters,
        LocalDate harvestDate,
        String processType,
        String qualityGrade,
        String cultivationConditions,
        List<PublicCertificationItem> certifications,
        List<PublicTimelineEvent> timeline
) {
}
