package com.raiza.demo.auth.service;

import com.raiza.demo.auth.dto.LoginRequest;
import com.raiza.demo.auth.dto.RegisterRequest;
import com.raiza.demo.auth.dto.TokenResponse;
import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.auth.repository.AppUserRepository;
import com.raiza.demo.security.jwt.JwtService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.security.service.JpaUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JpaUserDetailsService userDetailsService;
    private final JwtService jwtService;
    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;

    public TokenResponse login(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );

        UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername(request.getEmail());
        AppUser user = principal.getUser();
        String token = jwtService.generateToken(principal);

        return new TokenResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isOnboardingCompleted(),
                jwtService.getExpirationSeconds()
        );
    }

    public TokenResponse register(RegisterRequest request) {
        if (appUserRepository.existsByEmail(request.getEmail())) {
            throw new IllegalArgumentException("Email already in use");
        }

        AppUser user = new AppUser();
        user.setName(request.getName());
        user.setEmail(request.getEmail());
        user.setPassword(passwordEncoder.encode(request.getPassword()));
        user.setRole(request.getRole());
        appUserRepository.save(user);

        UserPrincipal principal = (UserPrincipal) userDetailsService.loadUserByUsername(request.getEmail());
        String token = jwtService.generateToken(principal);

        return new TokenResponse(
                token,
                user.getRole().name(),
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.isOnboardingCompleted(),
                jwtService.getExpirationSeconds()
        );
    }
}
