package com.raiza.demo.certification.dto;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

/**
 * Snapshot completo del momento de la solicitud.
 * Se serializa como JSON en la BD — sirve para regenerar el PDF
 * sin necesidad de volver a consultar otras tablas.
 */
public record CertificationApplicationPayload(

        // ── 1. Datos del productor ────────────────────────────────────────
        Long producerId,
        String producerName,
        String documentType,
        String documentNumber,
        String producerType,
        String phone,
        String email,
        String municipality,
        String department,
        String communityName,
        Boolean isCooperativeMember,
        String associationName,

        // ── 2. Datos de la finca ──────────────────────────────────────────
        Long farmId,
        String farmName,
        String farmMunicipality,
        String corregimiento,
        BigDecimal latitude,
        BigDecimal longitude,
        Integer altitudeMeters,
        BigDecimal areaHectares,
        String connectivityLevel,

        // ── 3. Datos productivos del lote ─────────────────────────────────
        Long lotId,
        String lotCode,
        Long productId,
        String productName,
        String productCategory,
        LocalDate harvestDate,
        BigDecimal estimatedVolume,
        String volumeUnit,
        String cultivationType,
        String cultivationConditions,
        String qualityGrade,
        String processType,

        // ── 4. Datos de la certificación solicitada ───────────────────────
        Long certificationId,
        String certificationName,
        String certificationIssuer,
        List<ProducerAnswerItem> producerAnswers,
        Boolean recommendedByAi,
        List<String> missingRequirements,

        // ── Metadatos del documento ───────────────────────────────────────
        String applicationCode,
        LocalDateTime generatedAt,
        String destinationEmail
) {}
