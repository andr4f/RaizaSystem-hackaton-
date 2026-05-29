package com.raiza.demo.auth.dto;

public record UserInfoResponse(
        Long userId,
        Long profileId,
        String name,
        String email,
        String role,
        boolean onboardingCompleted
) {}
