package com.raiza.demo.producer.dto;

import com.raiza.demo.shared.enums.ProducerType;

import java.time.LocalDateTime;

public record ProducerResponse(
        Long id,
        String name,
        String documentType,
        String documentNumber,
        ProducerType producerType,
        String phone,
        String email,
        String municipality,
        String department,
        String communityName,
        String bio,
        LocalDateTime createdAt
) {
}
