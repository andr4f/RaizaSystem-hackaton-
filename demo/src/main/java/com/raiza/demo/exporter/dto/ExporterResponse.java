package com.raiza.demo.exporter.dto;

public record ExporterResponse(
        Long id,
        String name,
        String companyName,
        String registrationCode,
        String contactName,
        String phone,
        String email,
        String municipality
) {
}
