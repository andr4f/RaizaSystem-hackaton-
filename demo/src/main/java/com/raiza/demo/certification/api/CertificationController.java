package com.raiza.demo.certification.api;

import com.raiza.demo.certification.dto.*;
import com.raiza.demo.certification.service.CertificationApplicationService;
import com.raiza.demo.certification.service.CertificationService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.enums.CertificationApplicationStatus;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequiredArgsConstructor
@Validated
public class CertificationController {

    private final CertificationService certificationService;
    private final CertificationApplicationService applicationService;

    // ── Catálogo de certificaciones ───────────────────────────────────────

    @PostMapping("/api/v1/certifications")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<CertificationResponse>> create(
            @RequestBody @Valid CreateCertificationRequest req,
            UriComponentsBuilder uriBuilder) {
        CertificationResponse created = certificationService.create(req);
        URI location = uriBuilder.path("/api/v1/certifications/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    // Público — catálogo usado en el onboarding del productor
    @GetMapping("/api/v1/certifications")
    public ResponseEntity<ApiResponse<List<CertificationResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.findAll()));
    }

    @GetMapping("/api/v1/certifications/{id}")
    public ResponseEntity<ApiResponse<CertificationResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.findById(id)));
    }

    // ── Validación de certificaciones (admin) ─────────────────────────────

    @PatchMapping("/api/v1/lot-certifications/{id}/validate")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<LotCertificationResponse>> validate(
            @PathVariable Long id,
            @RequestBody @Valid ValidateCertificationRequest req,
            Authentication auth) {
        UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
        Long adminId = principal.getUser().getId();
        LotCertificationResponse result = certificationService.validateCertification(
                id, adminId, req.status(), req.notes());
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    // ── Solicitudes de certificación ──────────────────────────────────────

    @PostMapping("/api/v1/certification-applications")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<CertificationApplicationResponse>> submitApplication(
            @RequestBody @Valid CertificationApplicationRequest req,
            UriComponentsBuilder uriBuilder) {
        CertificationApplicationResponse created = applicationService.submit(req);
        URI location = uriBuilder.path("/api/v1/certification-applications/{id}")
                .buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/api/v1/certification-applications")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<List<CertificationApplicationResponse>>> findApplications(
            @RequestParam(required = false) Long producerId,
            @RequestParam(required = false) CertificationApplicationStatus status) {
        List<CertificationApplicationResponse> result;
        if (producerId != null) {
            result = applicationService.findByProducer(producerId);
        } else if (status != null) {
            result = applicationService.findByStatus(status);
        } else {
            result = applicationService.findByStatus(CertificationApplicationStatus.SUBMITTED);
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/api/v1/certification-applications/{id}/pdf")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<byte[]> downloadPdf(@PathVariable Long id) {
        byte[] pdfBytes = applicationService.regeneratePdf(id);
        return ResponseEntity.ok()
                .contentType(MediaType.APPLICATION_PDF)
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=cert-application-" + id + ".pdf")
                .body(pdfBytes);
    }
}
