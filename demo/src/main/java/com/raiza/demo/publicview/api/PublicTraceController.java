package com.raiza.demo.publicview.api;

import com.raiza.demo.lead.dto.CreatePublicLeadRequest;
import com.raiza.demo.lead.dto.LeadResponse;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lead.service.PurchaseLeadService;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.service.ProductLotService;
import com.raiza.demo.publicview.dto.PublicExperienceResponse;
import com.raiza.demo.publicview.dto.PublicTraceResponse;
import com.raiza.demo.publicview.service.PublicTraceService;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.response.ApiResponse;
import com.raiza.demo.traceability.service.TraceEventService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/public")
@RequiredArgsConstructor
@Validated
public class PublicTraceController {

    private final PublicTraceService publicTraceService;
    private final PurchaseLeadService leadService;
    private final ProductLotService lotService;
    private final TraceEventService traceEventService;

    // ── Vista pública del lote por QR ─────────────────────────────────────

    @GetMapping("/trace/{qrSlug}")
    public ResponseEntity<ApiResponse<PublicTraceResponse>> getPublicTrace(
            @PathVariable String qrSlug) {
        return ResponseEntity.ok(ApiResponse.ok(publicTraceService.getByQrCode(qrSlug)));
    }

    // ── Registra el escaneo del QR ────────────────────────────────────────

    @PostMapping("/trace/{qrSlug}/scan")
    public ResponseEntity<ApiResponse<PublicTraceResponse>> scanQr(@PathVariable String qrSlug) {
        ProductLot lot = lotService.getByQrCodeValue(qrSlug);
        traceEventService.record(lot, TraceEventType.QR_SCANNED, ActorType.BUYER, null,
                "QR scanned: " + lot.getLotCode(),
                "Public QR scan registered for lot " + lot.getLotCode());
        return ResponseEntity.ok(ApiResponse.ok(publicTraceService.getByQrCode(qrSlug)));
    }

    // ── Crea intención de compra desde el QR ──────────────────────────────

    @PostMapping("/trace/{qrSlug}/lead")
    public ResponseEntity<ApiResponse<LeadResponse>> createLeadFromQr(
            @PathVariable String qrSlug,
            @RequestBody @Valid CreatePublicLeadRequest req,
            UriComponentsBuilder uriBuilder) {
        LeadResponse created = leadService.createPublicLead(req);
        URI location = uriBuilder.path("/api/v1/leads/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    // ── Vista pública de experiencia turística ────────────────────────────

    @GetMapping("/experiences/{slug}")
    public ResponseEntity<ApiResponse<PublicExperienceResponse>> getPublicExperience(
            @PathVariable String slug) {
        return ResponseEntity.ok(ApiResponse.ok(publicTraceService.getExperienceBySlug(slug)));
    }
}
