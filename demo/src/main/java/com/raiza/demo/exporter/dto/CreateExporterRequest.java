package com.raiza.demo.exporter.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateExporterRequest(
        @NotBlank @Size(max = 150) String name,
        @Size(max = 150) String companyName,
        @Size(max = 80) String registrationCode,
        @Size(max = 120) String contactName,
        @Size(max = 30) String phone,
        @Size(max = 120) String email,
        @Size(max = 80) String municipality
) {
}
