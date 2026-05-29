package com.raiza.demo.auth.api;

import com.raiza.demo.auth.dto.LoginRequest;
import com.raiza.demo.auth.dto.RegisterRequest;
import com.raiza.demo.auth.dto.TokenResponse;
import com.raiza.demo.auth.dto.UserInfoResponse;
import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.auth.service.AuthService;
import com.raiza.demo.auth.service.RegistrationService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/v1/auth")
@RequiredArgsConstructor
public class AuthController {

    private final AuthService authService;
    private final RegistrationService registrationService;

    @PostMapping("/login")
    public ResponseEntity<ApiResponse<TokenResponse>> login(@Valid @RequestBody LoginRequest request) {
        TokenResponse response = authService.login(request);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    @PostMapping("/register")
    public ResponseEntity<ApiResponse<TokenResponse>> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse response = registrationService.registerGeneric(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    @GetMapping("/me")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<UserInfoResponse>> me(Authentication authentication) {
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        AppUser user = principal.getUser();
        UserInfoResponse info = new UserInfoResponse(
                user.getId(),
                user.getProfileId(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                user.isOnboardingCompleted()
        );
        return ResponseEntity.ok(ApiResponse.ok(info));
    }
}
