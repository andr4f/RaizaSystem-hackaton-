package com.raiza.demo.tourism.api;

import com.raiza.demo.lead.dto.UpdateLeadStatusRequest;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.dto.FinanceSummaryResponse;
import com.raiza.demo.shared.dto.ReferenceItem;
import com.raiza.demo.shared.enums.ExperienceType;
import com.raiza.demo.shared.enums.UserRole;
import com.raiza.demo.shared.response.ApiResponse;
import com.raiza.demo.tourism.dto.*;
import com.raiza.demo.tourism.service.TourismService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/tourism")
@RequiredArgsConstructor
@Validated
public class TourismController {

    private final TourismService tourismService;

    // ── Catálogo de referencia (público, para onboarding) ─────────────────

    @GetMapping("/experience-types")
    public ResponseEntity<ApiResponse<List<ReferenceItem>>> experienceTypes() {
        return ResponseEntity.ok(ApiResponse.ok(ExperienceType.asItems()));
    }

    // ── Operadores turísticos ─────────────────────────────────────────────

    @PostMapping("/operators")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<TourismOperatorResponse>> createOperator(
            @RequestBody @Valid CreateTourismOperatorRequest req,
            UriComponentsBuilder uriBuilder) {
        TourismOperatorResponse created = tourismService.createOperator(req);
        URI location = uriBuilder.path("/api/v1/tourism/operators/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/operators")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TourismOperatorResponse>>> findAllOperators() {
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findAllOperators()));
    }

    @GetMapping("/operators/{id}/experiences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> findExperiencesByOperator(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findExperiencesByOperator(id)));
    }

    // ── Experiencias turísticas ───────────────────────────────────────────

    @PostMapping("/experiences")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<ExperienceResponse>> createExperience(
            @RequestBody @Valid CreateExperienceRequest req,
            UriComponentsBuilder uriBuilder) {
        ExperienceResponse created = tourismService.createExperience(req);
        URI location = uriBuilder.path("/api/v1/tourism/experiences/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/experiences")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ExperienceResponse>>> findAllExperiences() {
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findAllExperiences()));
    }

    @GetMapping("/experiences/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ExperienceResponse>> findExperienceById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findExperienceById(id)));
    }

    @GetMapping("/experiences/{id}/lots")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ExperienceLotResponse>>> findLotsByExperience(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findLotsForExperience(id)));
    }

    @PostMapping("/experiences/{experienceId}/lots/{lotId}")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<ExperienceLotResponse>> linkLot(
            @PathVariable Long experienceId,
            @PathVariable Long lotId,
            @RequestBody(required = false) LinkExperienceLotRequest req,
            UriComponentsBuilder uriBuilder) {
        LinkExperienceLotRequest linkReq = req != null ? req
                : new LinkExperienceLotRequest(experienceId, lotId, 1, null);
        ExperienceLotResponse created = tourismService.linkLot(linkReq);
        URI location = uriBuilder.path("/api/v1/tourism/experiences/{id}/lots")
                .buildAndExpand(experienceId).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    // ── Leads, visitas, reservas y finanzas del operador ─────────────────

    @GetMapping("/operators/{id}/leads")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<List<TourismLeadResponse>>> findLeads(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertOperatorAccess(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findLeadsByOperator(id)));
    }

    @GetMapping("/operators/{id}/visits")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<List<TourismVisitResponse>>> findVisits(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertOperatorAccess(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findVisitsByOperator(id)));
    }

    @GetMapping("/operators/{id}/bookings")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<List<TourismBookingResponse>>> findBookings(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertOperatorAccess(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findBookingsByOperator(id)));
    }

    @GetMapping("/operators/{id}/finance")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<FinanceSummaryResponse>> findFinance(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertOperatorAccess(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(tourismService.findFinanceByOperator(id)));
    }

    @PatchMapping("/operators/{operatorId}/leads/{leadId}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'TOURISM_OPERATOR')")
    public ResponseEntity<ApiResponse<TourismLeadResponse>> updateLeadStatus(
            @PathVariable Long operatorId,
            @PathVariable Long leadId,
            @RequestBody @Valid UpdateLeadStatusRequest req,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertOperatorAccess(operatorId, principal);
        return ResponseEntity.ok(ApiResponse.ok(tourismService.updateLeadStatus(operatorId, leadId, req)));
    }

    private void assertOperatorAccess(Long operatorId, UserPrincipal principal) {
        boolean isAdmin = principal.getUser().getRole() == UserRole.ADMIN;
        tourismService.assertOperatorAccess(operatorId, principal.getUser().getProfileId(), isAdmin);
    }
}
