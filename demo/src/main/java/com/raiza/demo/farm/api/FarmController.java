package com.raiza.demo.farm.api;

import com.raiza.demo.farm.dto.CreateFarmRequest;
import com.raiza.demo.farm.dto.FarmResponse;
import com.raiza.demo.farm.service.FarmService;
import com.raiza.demo.shared.response.ApiResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.util.UriComponentsBuilder;

import java.net.URI;

@RestController
@RequestMapping("/api/v1/farms")
@RequiredArgsConstructor
@Validated
public class FarmController {

    private final FarmService farmService;

    @PostMapping
    @PreAuthorize("hasAnyRole('ADMIN', 'PRODUCER')")
    public ResponseEntity<ApiResponse<FarmResponse>> create(
            @RequestBody @Valid CreateFarmRequest req,
            UriComponentsBuilder uriBuilder) {
        FarmResponse created = farmService.create(req);
        URI location = uriBuilder.path("/api/v1/farms/{id}").buildAndExpand(created.id()).toUri();
        return ResponseEntity.created(location).body(ApiResponse.created(created));
    }

    @GetMapping("/{id}")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<FarmResponse>> findById(@PathVariable Long id) {
        return ResponseEntity.ok(ApiResponse.ok(farmService.findById(id)));
    }
}
