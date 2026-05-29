package com.raiza.demo.tourism.dto;

import com.raiza.demo.shared.enums.TraceEventType;

import java.time.LocalDateTime;

public record TourismVisitResponse(
        Long id,
        Long lotId,
        String lotCode,
        Long experienceId,
        String experienceTitle,
        TraceEventType eventType,
        LocalDateTime eventTimestamp,
        String title,
        String description,
        String visitorName
) {
}
