package com.raiza.demo.auth.service;

import com.raiza.demo.auth.dto.LoginRequest;
import com.raiza.demo.auth.dto.TokenResponse;
import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.security.jwt.JwtService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.security.service.JpaUserDetailsService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final JpaUserDetailsService userDetailsService;
    private final JwtService jwtService;

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
}
