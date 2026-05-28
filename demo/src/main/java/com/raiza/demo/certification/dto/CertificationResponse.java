package com.raiza.demo.certification.dto;

public record CertificationResponse(
        Long id,
        String name,
        String issuer,
        String description
) {
}
