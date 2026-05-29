package com.raiza.demo.exporter.api;

import com.raiza.demo.exporter.dto.CreateExporterRequest;
import com.raiza.demo.exporter.dto.ExporterOrderResponse;
import com.raiza.demo.exporter.dto.ExporterResponse;
import com.raiza.demo.exporter.dto.ExporterReviewResponse;
import com.raiza.demo.exporter.service.ExportReviewService;
import com.raiza.demo.exporter.service.ExporterService;
import com.raiza.demo.finance.service.FinanceService;
import com.raiza.demo.shared.dto.FinanceSummaryResponse;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.enums.UserRole;
import com.raiza.demo.shared.exception.ForbiddenException;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/exporters")
@RequiredArgsConstructor
@Validated
public class ExporterController {

    private final ExporterService exporterService;
    private final ExportReviewService exportReviewService;
    private final FinanceService financeService;

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<ApiResponse<ExporterResponse>> create(
            @RequestBody @Valid CreateExporterRequest req,
            UriComponentsBuilder uriBuilder) {
        ExporterResponse created = exporterService.create(req);
        URI location = uriBuilder.path("/api/v1/exporters/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<List<ExporterResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(exporterService.findAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<ExporterResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(exporterService.findById(id)));
    }

    @GetMapping("/{id}/reviews")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<List<ExporterReviewResponse>>> findReviews(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(exportReviewService.findByExporter(id)));
    }

    @GetMapping("/{id}/orders")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<List<ExporterOrderResponse>>> findOrders(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertExporterAccess(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(exportReviewService.findOrdersByExporter(id)));
    }

    @GetMapping("/{id}/finance")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<FinanceSummaryResponse>> findFinance(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal) {
        assertExporterAccess(id, principal);
        return ResponseEntity.ok(ApiResponse.ok(financeService.forExporter(id)));
    }

    private void assertExporterAccess(Long exporterId, UserPrincipal principal) {
        if (principal.getUser().getRole() != UserRole.ADMIN
                && !exporterId.equals(principal.getUser().getProfileId())) {
            throw new ForbiddenException("Access denied for this exporter");
        }
    }
}
