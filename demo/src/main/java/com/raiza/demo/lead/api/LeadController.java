package com.raiza.demo.lead.api;

import com.raiza.demo.exporter.dto.ExporterReviewRequest;
import com.raiza.demo.exporter.dto.ExporterReviewResponse;
import com.raiza.demo.exporter.service.ExportReviewService;
import com.raiza.demo.lead.dto.LeadResponse;
import com.raiza.demo.lead.dto.UpdateLeadStatusRequest;
import com.raiza.demo.lead.service.PurchaseLeadService;
import com.raiza.demo.shared.enums.LeadStatus;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.raiza.demo.security.model.UserPrincipal;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/leads")
@RequiredArgsConstructor
@Validated
public class LeadController {

    private final PurchaseLeadService leadService;
    private final ExportReviewService exportReviewService;

    // ── Leads ─────────────────────────────────────────────────────────────

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER', 'PRODUCER')")
    public ResponseEntity<ApiResponse<List<LeadResponse>>> findAll(
            @RequestParam(required = false) LeadStatus status,
            @RequestParam(required = false) Long lotId,
            @AuthenticationPrincipal UserPrincipal principal) {
        List<LeadResponse> result;
        if (principal.getUser().getRole().name().equals("PRODUCER")) {
            result = leadService.findByProducer(principal.getUser().getProfileId());
        } else if (status != null) {
            result = leadService.findByStatus(status);
        } else if (lotId != null) {
            result = leadService.findByLot(lotId);
        } else {
            result = leadService.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER', 'PRODUCER')")
    public ResponseEntity<ApiResponse<LeadResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.findById(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER', 'PRODUCER')")
    public ResponseEntity<ApiResponse<LeadResponse>> updateStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateLeadStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(leadService.updateStatus(id, req)));
    }

    // ── Export review del lead ─────────────────────────────────────────────

    @PostMapping("/{id}/export-review")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<ExporterReviewResponse>> createExportReview(
            @PathVariable Long id,
            @RequestBody @Valid ExporterReviewRequest req,
            UriComponentsBuilder uriBuilder) {
        ExporterReviewResponse created = exportReviewService.createReview(req);
        URI location = uriBuilder.path("/api/v1/leads/{id}/export-review").buildAndExpand(id).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/{id}/export-review")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<List<ExporterReviewResponse>>> findExportReviews(
            @PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(exportReviewService.findByLead(id)));
    }
}
