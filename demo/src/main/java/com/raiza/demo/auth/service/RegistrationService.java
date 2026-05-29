package com.raiza.demo.auth.service;

import com.raiza.demo.auth.dto.*;
import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.auth.repository.AppUserRepository;
import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.buyer.service.BuyerService;
import com.raiza.demo.shared.enums.BuyerType;
import com.raiza.demo.exporter.dto.CreateExporterRequest;
import com.raiza.demo.exporter.dto.ExporterResponse;
import com.raiza.demo.exporter.service.ExporterService;
import com.raiza.demo.producer.dto.CreateProducerRequest;
import com.raiza.demo.producer.dto.ProducerResponse;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.security.jwt.JwtService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.enums.ProducerType;
import com.raiza.demo.shared.enums.UserRole;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.tourism.dto.CreateTourismOperatorRequest;
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

    /** Registro genérico desde el formulario simple (name, email, password, role).
     *  Crea automáticamente la entidad de dominio con datos mínimos. */
    @Transactional
    public TokenResponse registerGeneric(RegisterRequest req) {
        ensureEmailAvailable(req.getEmail());
        AppUser user = switch (req.getRole()) {
            case PRODUCER -> {
                CreateProducerRequest profile = new CreateProducerRequest(
                        req.getName(), null, null, ProducerType.INDIVIDUAL,
                        null, req.getEmail(), "Sin definir", "Magdalena", null, null, null);
                ProducerResponse producer = producerService.create(profile);
                yield createAccount(req.getEmail(), req.getPassword(), req.getName(),
                        UserRole.PRODUCER, producer.id());
            }
            case EXPORTER -> {
                CreateExporterRequest profile = new CreateExporterRequest(
                        req.getName(), null, null, null, null, req.getEmail(), null, null, null, null);
                ExporterResponse exporter = exporterService.create(profile);
                yield createAccount(req.getEmail(), req.getPassword(), req.getName(),
                        UserRole.EXPORTER, exporter.id());
            }
            case TOURISM_OPERATOR -> {
                CreateTourismOperatorRequest profile = new CreateTourismOperatorRequest(
                        req.getName(), "General", null, null, req.getEmail(), null, null, null, null, null);
                TourismOperatorResponse operator = tourismService.createOperator(profile);
                yield createAccount(req.getEmail(), req.getPassword(), req.getName(),
                        UserRole.TOURISM_OPERATOR, operator.id());
            }
            case BUYER -> {
                Buyer buyer = buyerService.findOrCreate(
                        BuyerType.INDIVIDUAL, req.getName(),
                        null, null, null, req.getEmail(), null);
                yield createAccount(req.getEmail(), req.getPassword(), req.getName(),
                        UserRole.BUYER, buyer.getId());
            }
            default -> createAccount(req.getEmail(), req.getPassword(), req.getName(),
                    req.getRole(), null);
        };
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
        user.setOnboardingCompleted(true);
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
                user.getProfileId(),
                user.getName(),
                user.getEmail(),
                user.isOnboardingCompleted(),
                jwtService.getExpirationSeconds()
        );
    }
}
