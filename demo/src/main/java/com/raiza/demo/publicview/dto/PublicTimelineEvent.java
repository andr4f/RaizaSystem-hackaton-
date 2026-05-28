package com.raiza.demo.publicview.dto;

import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PublicTimelineEvent(
        TraceEventType eventType,
        LocalDateTime eventTimestamp,
        String title,
        String description,
        ActorType actorType,
        BigDecimal latitude,
        BigDecimal longitude,
        String metricName,
        String metricValue,
        String metricUnit,
        String hashValue,
        String previousHash
) {
}
