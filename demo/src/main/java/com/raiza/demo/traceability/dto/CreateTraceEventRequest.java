package com.raiza.demo.traceability.dto;

import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record CreateTraceEventRequest(
        @NotNull Long lotId,
        @NotNull TraceEventType eventType,
        LocalDateTime eventTimestamp,
        @NotNull ActorType actorType,
        Long actorId,
        @NotBlank String title,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        String metricName,
        String metricValue,
        String metricUnit
) {
}
