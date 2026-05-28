package com.raiza.demo.tourism.dto;

public record TourismOperatorResponse(
        Long id,
        String name,
        String operatorType,
        String contactName,
        String phone,
        String email,
        String municipality,
        String website
) {
}
