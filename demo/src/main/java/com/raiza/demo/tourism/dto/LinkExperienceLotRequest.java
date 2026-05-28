package com.raiza.demo.tourism.dto;

import jakarta.validation.constraints.NotNull;

public record LinkExperienceLotRequest(
        @NotNull Long experienceId,
        @NotNull Long lotId,
        Integer displayPriority,
        String notes
) {
}
