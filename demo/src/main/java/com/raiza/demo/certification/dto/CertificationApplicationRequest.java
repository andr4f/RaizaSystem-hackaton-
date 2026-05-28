package com.raiza.demo.certification.dto;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.util.List;

/**
 * El frontend solo envía IDs + datos específicos del formulario.
 * El backend enriquece el payload completo consultando la BD.
 */
public record CertificationApplicationRequest(

        // ── Identificadores ──────────────────────────────────────────────
        @NotNull(message = "Producer is required")
        Long producerId,

        @NotNull(message = "Farm is required")
        Long farmId,

        @NotNull(message = "Lot is required")
        Long lotId,

        @NotNull(message = "Certification type is required")
        Long certificationId,

        // ── Datos de asociación (bloque 1 extra) ─────────────────────────
        Boolean isCooperativeMember,
        String associationName,

        // ── Datos productivos específicos del formulario (bloque 3) ──────
        BigDecimal estimatedVolume,
        String volumeUnit,
        String cultivationType,

        // ── Respuestas del cuestionario guiado por IA (bloque 4) ─────────
        @Valid
        List<ProducerAnswerItem> producerAnswers,

        // ── Metadatos de la solicitud ─────────────────────────────────────
        Boolean recommendedByAi,
        List<String> missingRequirements,
        String destinationEmail
) {}
