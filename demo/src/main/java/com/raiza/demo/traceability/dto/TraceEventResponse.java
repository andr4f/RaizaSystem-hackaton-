package com.raiza.demo.traceability.dto;

import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record TraceEventResponse(
        Long id,
        Long lotId,
        TraceEventType eventType,
        LocalDateTime eventTimestamp,
        ActorType actorType,
        Long actorId,
        String title,
        String description,
        BigDecimal latitude,
        BigDecimal longitude,
        String metricName,
        String metricValue,
        String metricUnit,
        String hashValue,
        String previousHash,
        LocalDateTime createdAt
) {
}
