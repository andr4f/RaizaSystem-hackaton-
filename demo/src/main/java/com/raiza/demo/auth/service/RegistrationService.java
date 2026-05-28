package com.raiza.demo.auth.service;

import com.raiza.demo.auth.dto.*;
import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.auth.repository.AppUserRepository;
import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.buyer.service.BuyerService;
import com.raiza.demo.exporter.dto.ExporterResponse;
import com.raiza.demo.exporter.service.ExporterService;
import com.raiza.demo.producer.dto.ProducerResponse;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.security.jwt.JwtService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.enums.UserRole;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.tourism.dto.TourismOperatorResponse;
import com.raiza.demo.tourism.service.TourismService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class RegistrationService {

    private final AppUserRepository appUserRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    private final ProducerService producerService;
    private final ExporterService exporterService;
    private final TourismService tourismService;
    private final BuyerService buyerService;

    @Transactional
    public TokenResponse registerProducer(RegisterProducerRequest req) {
        ensureEmailAvailable(req.email());
        ProducerResponse producer = producerService.create(req.profile());
        AppUser user = createAccount(req.email(), req.password(), req.profile().name(),
                UserRole.PRODUCER, producer.id());
        return buildToken(user);
    }

    @Transactional
    public TokenResponse registerExporter(RegisterExporterRequest req) {
        ensureEmailAvailable(req.email());
        ExporterResponse exporter = exporterService.create(req.profile());
        AppUser user = createAccount(req.email(), req.password(), req.profile().name(),
                UserRole.EXPORTER, exporter.id());
        return buildToken(user);
    }

    @Transactional
    public TokenResponse registerTourismOperator(RegisterTourismOperatorRequest req) {
        ensureEmailAvailable(req.email());
        TourismOperatorResponse operator = tourismService.createOperator(req.profile());
        AppUser user = createAccount(req.email(), req.password(), req.profile().name(),
                UserRole.TOURISM_OPERATOR, operator.id());
        return buildToken(user);
    }

    @Transactional
    public TokenResponse registerBuyer(RegisterBuyerRequest req) {
        ensureEmailAvailable(req.email());
        Buyer buyer = buyerService.findOrCreate(req.buyerType(), req.name(), req.companyName(),
                req.country(), req.phone(), req.email(), req.preferredLanguage());
        AppUser user = createAccount(req.email(), req.password(), req.name(),
                UserRole.BUYER, buyer.getId());
        return buildToken(user);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    private void ensureEmailAvailable(String email) {
        if (appUserRepository.existsByEmail(email)) {
            throw new DuplicateResourceException("Email already registered: " + email);
        }
    }

    private AppUser createAccount(String email, String rawPassword, String name,
                                  UserRole role, Long profileId) {
        AppUser user = new AppUser();
        user.setName(name);
        user.setEmail(email);
        user.setPassword(passwordEncoder.encode(rawPassword));
        user.setRole(role);
        user.setActive(true);
        user.setOnboardingCompleted(true); // registro de un solo paso: perfil ya creado
        user.setProfileId(profileId);
        user.setProfileType(role.name());
        return appUserRepository.save(user);
    }

    private TokenResponse buildToken(AppUser user) {
        UserPrincipal principal = new UserPrincipal(user);
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
