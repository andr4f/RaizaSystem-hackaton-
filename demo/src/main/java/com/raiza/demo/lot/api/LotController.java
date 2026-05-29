package com.raiza.demo.lot.api;

import com.raiza.demo.certification.dto.AttachCertificationRequest;
import com.raiza.demo.certification.dto.LotCertificationResponse;
import com.raiza.demo.certification.service.CertificationService;
import com.raiza.demo.lot.dto.CreateLotRequest;
import com.raiza.demo.lot.dto.LotDetailResponse;
import com.raiza.demo.lot.dto.LotResponse;
import com.raiza.demo.lot.dto.UpdateLotStatusRequest;
import com.raiza.demo.lot.service.ProductLotService;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.response.ApiResponse;
import com.raiza.demo.traceability.dto.CreateTraceEventRequest;
import com.raiza.demo.traceability.dto.TraceEventResponse;
import com.raiza.demo.traceability.service.TraceEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;
import java.util.List;

@RestController
@RequestMapping("/api/v1/lots")
@RequiredArgsConstructor
@Validated
public class LotController {

    private final ProductLotService lotService;
    private final TraceEventService traceEventService;
    private final CertificationService certificationService;

    // ── Lotes ─────────────────────────────────────────────────────────────

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<LotResponse>> create(
            @RequestBody @Valid CreateLotRequest req,
            UriComponentsBuilder uriBuilder) {
        LotResponse created = lotService.create(req);
        URI location = uriBuilder.path("/api/v1/lots/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LotResponse>>> findAll(
            @RequestParam(required = false) LotStatus status,
            @RequestParam(required = false) Long producerId) {
        List<LotResponse> result;
        if (status != null) {
            result = lotService.findByStatus(status);
        } else if (producerId != null) {
            result = lotService.findByProducer(producerId);
        } else {
            result = lotService.findAll();
        }
        return ResponseEntity.ok(ApiResponse.ok(result));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LotResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lotService.findById(id)));
    }

    @GetMapping("/{id}/detail")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LotDetailResponse>> getDetail(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lotService.getDetail(id)));
    }

    @PatchMapping("/{id}/status")
    @PreAuthorize("hasAnyRole('ADMIN', 'EXPORTER')")
    public ResponseEntity<ApiResponse<LotResponse>> changeStatus(
            @PathVariable Long id,
            @RequestBody @Valid UpdateLotStatusRequest req) {
        return ResponseEntity.ok(ApiResponse.ok(lotService.changeStatus(id, req)));
    }

    // ── Eventos de trazabilidad del lote ──────────────────────────────────

    @PostMapping("/{id}/events")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER', 'TOURISM_OPERATOR', 'EXPORTER')")
    public ResponseEntity<ApiResponse<TraceEventResponse>> createEvent(
            @PathVariable Long id,
            @RequestBody @Valid CreateTraceEventRequest req,
            UriComponentsBuilder uriBuilder) {
        TraceEventResponse created = traceEventService.createTraceEvent(req);
        URI location = uriBuilder.path("/api/v1/lots/{id}/events").buildAndExpand(id).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/{id}/events")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<TraceEventResponse>>> getTimeline(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(traceEventService.getTimeline(id)));
    }

    @GetMapping("/{id}/traceability")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<LotDetailResponse>> getTraceability(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(lotService.getDetail(id)));
    }

    // ── Certificaciones del lote ──────────────────────────────────────────

    @PostMapping("/{id}/certifications")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<LotCertificationResponse>> attachCertification(
            @PathVariable Long id,
            @RequestBody @Valid AttachCertificationRequest req,
            UriComponentsBuilder uriBuilder) {
        LotCertificationResponse created = certificationService.attachToLot(id, req);
        URI location = uriBuilder.path("/api/v1/lots/{id}/certifications").buildAndExpand(id).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/{id}/certifications")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<LotCertificationResponse>>> findCertifications(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(certificationService.findByLot(id)));
    }
}
