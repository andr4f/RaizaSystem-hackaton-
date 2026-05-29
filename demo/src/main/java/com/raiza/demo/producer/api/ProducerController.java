package com.raiza.demo.producer.api;

import com.raiza.demo.farm.dto.CreateFarmRequest;
import com.raiza.demo.farm.dto.FarmResponse;
import com.raiza.demo.farm.service.FarmService;
import com.raiza.demo.producer.dto.CreateProducerRequest;
import com.raiza.demo.producer.dto.ProducerResponse;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.shared.response.ApiResponse;
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
@RequestMapping("/api/v1/producers")
@RequiredArgsConstructor
@Validated
public class ProducerController {

    private final ProducerService producerService;
    private final FarmService farmService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<ProducerResponse>> create(
            @RequestBody @Valid CreateProducerRequest req,
            UriComponentsBuilder uriBuilder) {
        ProducerResponse created = producerService.create(req);
        URI location = uriBuilder.path("/api/v1/producers/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<ProducerResponse>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(producerService.findAll()));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<ProducerResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(producerService.findById(id)));
    }

    @GetMapping("/{id}/farms")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<List<FarmResponse>>> findFarmsByProducer(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(farmService.findByProducer(id)));
    }

    @PostMapping("/{id}/farms")
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<FarmResponse>> createFarm(
            @PathVariable Long id,
            @RequestBody @Valid CreateFarmRequest req,
            UriComponentsBuilder uriBuilder) {
        FarmResponse created = farmService.create(req);
        URI location = uriBuilder.path("/api/v1/farms/{farmId}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }
}
