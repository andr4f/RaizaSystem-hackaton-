package com.raiza.demo.producer.dto;

import com.raiza.demo.shared.enums.ProducerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record CreateProducerRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 20) String documentType,
        @Size(max = 50) String documentNumber,
        @NotNull ProducerType producerType,
        @Size(max = 30) String phone,
        @Size(max = 120) String email,
        @NotBlank @Size(max = 80) String municipality,
        @Size(max = 80) String department,
        @Size(max = 120) String communityName
) {
}
