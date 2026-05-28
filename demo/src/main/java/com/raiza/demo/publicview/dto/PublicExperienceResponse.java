package com.raiza.demo.publicview.dto;

import java.util.List;

public record PublicExperienceResponse(
        String qrSlug,
        String title,
        String locationName,
        String description,
        String operatorName,
        String operatorType,
        List<PublicTraceResponse> lots
) {
}
