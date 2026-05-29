package com.raiza.demo.publicview.dto;

import com.raiza.demo.shared.enums.ProducerType;

public record PublicProducerResponse(
        Long id,
        String name,
        ProducerType producerType,
        String municipality,
        String department,
        String communityName,
        String mainProduct,
        String bio
) {
}
