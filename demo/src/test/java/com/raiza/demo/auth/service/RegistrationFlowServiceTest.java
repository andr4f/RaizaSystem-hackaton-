package com.raiza.demo.auth.service;

import com.raiza.demo.auth.dto.RegisterRequest;
import com.raiza.demo.auth.dto.TokenResponse;
import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.auth.repository.AppUserRepository;
import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.buyer.service.BuyerService;
import com.raiza.demo.exporter.dto.ExporterResponse;
import com.raiza.demo.exporter.service.ExporterService;
import com.raiza.demo.producer.dto.ProducerResponse;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.security.jwt.JwtService;
import com.raiza.demo.shared.enums.BuyerType;
import com.raiza.demo.shared.enums.UserRole;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.tourism.dto.TourismOperatorResponse;
import com.raiza.demo.tourism.service.TourismService;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.ArgumentCaptor;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.crypto.password.PasswordEncoder;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.ArgumentMatchers.eq;
import static org.mockito.Mockito.*;

/**
 * Verifica que el flujo de registro genérico crea la entidad de dominio correcta
 * para cada rol y vincula el profileId en el token, condición necesaria para que
 * el frontend pueda redirigir al dashboard correspondiente.
 */
@ExtendWith(MockitoExtension.class)
class RegistrationFlowServiceTest {

    @Mock AppUserRepository appUserRepository;
    @Mock PasswordEncoder passwordEncoder;
    @Mock JwtService jwtService;
    @Mock ProducerService producerService;
    @Mock ExporterService exporterService;
    @Mock TourismService tourismService;
    @Mock BuyerService buyerService;

    @InjectMocks RegistrationService registrationService;

    // ─── Helpers ─────────────────────────────────────────────────────────────

    private RegisterRequest req(String name, String email, UserRole role) {
        RegisterRequest r = new RegisterRequest();
        r.setName(name);
        r.setEmail(email);
        r.setPassword("password123");
        r.setRole(role);
        return r;
    }

    private void stubSave(Long userId) {
        when(passwordEncoder.encode(anyString())).thenReturn("$2a$hashed");
        when(appUserRepository.save(any())).thenAnswer(inv -> {
            AppUser u = inv.getArgument(0);
            u.setId(userId);
            return u;
        });
        when(jwtService.generateToken(any())).thenReturn("jwt.token.value");
        when(jwtService.getExpirationSeconds()).thenReturn(86400L);
    }

    // ─── Productor ────────────────────────────────────────────────────────────

    @Test
    void registerProducer_createsProducerEntity_andProfileIdIsInToken() {
        when(appUserRepository.existsByEmail("maria@minca.co")).thenReturn(false);
        when(producerService.create(any())).thenReturn(
            new ProducerResponse(42L, "María López", null, null, null, null,
                "maria@minca.co", "Minca", "Magdalena", "Caficultores de Minca", null));
        stubSave(100L);

        TokenResponse token = registrationService.registerGeneric(req("María López", "maria@minca.co", UserRole.PRODUCER));

        ArgumentCaptor<AppUser> savedUser = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserRepository).save(savedUser.capture());

        assertThat(savedUser.getValue().getRole()).isEqualTo(UserRole.PRODUCER);
        assertThat(savedUser.getValue().getProfileId()).isEqualTo(42L);
        assertThat(token.getProfileId()).isEqualTo(42L);
        assertThat(token.getRole()).isEqualTo("PRODUCER");
        assertThat(token.getToken()).isNotBlank();
    }

    @Test
    void registerProducer_usesDefaultValues_whenOptionalFieldsNotProvided() {
        when(appUserRepository.existsByEmail("juan@test.co")).thenReturn(false);
        when(producerService.create(any())).thenReturn(
            new ProducerResponse(10L, "Juan Productor", null, null, null, null,
                "juan@test.co", "Sin definir", "Magdalena", null, null));
        stubSave(200L);

        registrationService.registerGeneric(req("Juan Productor", "juan@test.co", UserRole.PRODUCER));

        verify(producerService).create(argThat(p ->
            p.name().equals("Juan Productor") &&
            p.municipality().equals("Sin definir") &&
            p.department().equals("Magdalena")
        ));
    }

    // ─── Exportador ───────────────────────────────────────────────────────────

    @Test
    void registerExporter_createsExporterEntity_andProfileIdIsInToken() {
        when(appUserRepository.existsByEmail("exp@magdalena.co")).thenReturn(false);
        when(exporterService.create(any())).thenReturn(
            new ExporterResponse(55L, "Exportadora Magdalena", "ExportMag SAS",
                null, null, null, "exp@magdalena.co", "Santa Marta"));
        stubSave(101L);

        TokenResponse token = registrationService.registerGeneric(req("Exportadora Magdalena", "exp@magdalena.co", UserRole.EXPORTER));

        ArgumentCaptor<AppUser> savedUser = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserRepository).save(savedUser.capture());

        assertThat(savedUser.getValue().getRole()).isEqualTo(UserRole.EXPORTER);
        assertThat(savedUser.getValue().getProfileId()).isEqualTo(55L);
        assertThat(token.getProfileId()).isEqualTo(55L);
        assertThat(token.getRole()).isEqualTo("EXPORTER");
    }

    // ─── Operador turístico ───────────────────────────────────────────────────

    @Test
    void registerTourismOperator_createsOperatorEntity_andProfileIdIsInToken() {
        when(appUserRepository.existsByEmail("eco@minca.co")).thenReturn(false);
        when(tourismService.createOperator(any())).thenReturn(
            new TourismOperatorResponse(77L, "EcoTur Minca", "General",
                null, null, "eco@minca.co", "Minca", null));
        stubSave(102L);

        TokenResponse token = registrationService.registerGeneric(req("EcoTur Minca", "eco@minca.co", UserRole.TOURISM_OPERATOR));

        ArgumentCaptor<AppUser> savedUser = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserRepository).save(savedUser.capture());

        assertThat(savedUser.getValue().getRole()).isEqualTo(UserRole.TOURISM_OPERATOR);
        assertThat(savedUser.getValue().getProfileId()).isEqualTo(77L);
        assertThat(token.getProfileId()).isEqualTo(77L);
        assertThat(token.getRole()).isEqualTo("TOURISM_OPERATOR");
    }

    // ─── Comprador individual ─────────────────────────────────────────────────

    @Test
    void registerBuyer_createsBuyerAsIndividual_andProfileIdIsInToken() {
        Buyer buyer = mock(Buyer.class);
        when(buyer.getId()).thenReturn(88L);

        when(appUserRepository.existsByEmail("visitante@test.co")).thenReturn(false);
        when(buyerService.findOrCreate(
            eq(BuyerType.INDIVIDUAL), eq("Visitante Web"),
            any(), any(), any(), eq("visitante@test.co"), any()
        )).thenReturn(buyer);
        stubSave(103L);

        TokenResponse token = registrationService.registerGeneric(req("Visitante Web", "visitante@test.co", UserRole.BUYER));

        verify(buyerService).findOrCreate(
            eq(BuyerType.INDIVIDUAL), eq("Visitante Web"),
            any(), any(), any(), eq("visitante@test.co"), any());
        assertThat(token.getProfileId()).isEqualTo(88L);
        assertThat(token.getRole()).isEqualTo("BUYER");
    }

    // ─── Casos de error ───────────────────────────────────────────────────────

    @Test
    void register_throwsDuplicateException_whenEmailAlreadyRegistered() {
        when(appUserRepository.existsByEmail("duplicado@test.co")).thenReturn(true);

        assertThatThrownBy(() -> registrationService.registerGeneric(
            req("Duplicado", "duplicado@test.co", UserRole.PRODUCER)))
            .isInstanceOf(DuplicateResourceException.class);

        verify(producerService, never()).create(any());
        verify(appUserRepository, never()).save(any());
    }

    // ─── Invariantes de todos los registros ───────────────────────────────────

    @Test
    void allRegisteredUsers_haveOnboardingCompleted_true() {
        when(appUserRepository.existsByEmail("new@test.co")).thenReturn(false);
        when(producerService.create(any())).thenReturn(
            new ProducerResponse(1L, "Test", null, null, null, null,
                "new@test.co", "X", "Magdalena", null, null));
        stubSave(300L);

        registrationService.registerGeneric(req("Test", "new@test.co", UserRole.PRODUCER));

        ArgumentCaptor<AppUser> saved = ArgumentCaptor.forClass(AppUser.class);
        verify(appUserRepository).save(saved.capture());
        assertThat(saved.getValue().isOnboardingCompleted()).isTrue();
        assertThat(saved.getValue().isActive()).isTrue();
    }

    @Test
    void token_containsUserInfo_neededForFrontendRedirect() {
        when(appUserRepository.existsByEmail("front@test.co")).thenReturn(false);
        when(producerService.create(any())).thenReturn(
            new ProducerResponse(99L, "Productor Fronted", null, null, null, null,
                "front@test.co", "Ciénaga", "Magdalena", null, null));
        stubSave(400L);

        TokenResponse token = registrationService.registerGeneric(
            req("Productor Fronted", "front@test.co", UserRole.PRODUCER));

        // The frontend uses these fields to redirect to the correct dashboard
        assertThat(token.getToken()).isNotBlank();
        assertThat(token.getRole()).isEqualTo("PRODUCER");
        assertThat(token.getProfileId()).isEqualTo(99L);
        assertThat(token.getUserId()).isEqualTo(400L);
        assertThat(token.getEmail()).isEqualTo("front@test.co");
    }
}
