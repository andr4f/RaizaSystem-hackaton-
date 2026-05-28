package com.raiza.demo.auth.api;

<<<<<<< HEAD
import com.raiza.demo.auth.dto.LoginRequest;
import com.raiza.demo.auth.dto.RegisterRequest;
import com.raiza.demo.auth.dto.TokenResponse;
=======
import com.raiza.demo.auth.dto.*;
>>>>>>> origin/backend
import com.raiza.demo.auth.service.AuthService;
import com.raiza.demo.auth.service.RegistrationService;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

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

<<<<<<< HEAD
    @PostMapping("/register")
    public ResponseEntity<ApiResponse<TokenResponse>> register(@Valid @RequestBody RegisterRequest request) {
        TokenResponse response = authService.register(request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
=======
    // ── Registro público — un endpoint por flujo de actor ─────────────────
    // El rol lo asigna el endpoint; el usuario NO lo elige.

    @PostMapping("/register/producer")
    public ResponseEntity<ApiResponse<TokenResponse>> registerProducer(
            @Valid @RequestBody RegisterProducerRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(registrationService.registerProducer(request)));
    }

    @PostMapping("/register/exporter")
    public ResponseEntity<ApiResponse<TokenResponse>> registerExporter(
            @Valid @RequestBody RegisterExporterRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(registrationService.registerExporter(request)));
    }

    @PostMapping("/register/tourism-operator")
    public ResponseEntity<ApiResponse<TokenResponse>> registerTourismOperator(
            @Valid @RequestBody RegisterTourismOperatorRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(registrationService.registerTourismOperator(request)));
    }

    @PostMapping("/register/buyer")
    public ResponseEntity<ApiResponse<TokenResponse>> registerBuyer(
            @Valid @RequestBody RegisterBuyerRequest request) {
        return ResponseEntity.status(201).body(ApiResponse.created(registrationService.registerBuyer(request)));
>>>>>>> origin/backend
    }
}
