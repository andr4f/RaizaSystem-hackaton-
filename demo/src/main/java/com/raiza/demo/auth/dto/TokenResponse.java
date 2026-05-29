package com.raiza.demo.auth.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class TokenResponse {

    private String token;
    private String role;
    private Long userId;
    private Long profileId;
    private String name;
    private String email;
    private boolean onboardingCompleted;
    private long expiresIn;
}
