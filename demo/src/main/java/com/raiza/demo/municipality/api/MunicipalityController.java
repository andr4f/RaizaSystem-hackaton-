package com.raiza.demo.municipality.api;

import com.raiza.demo.municipality.dto.MunicipalityResponse;
import com.raiza.demo.municipality.service.MunicipalityService;
import com.raiza.demo.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/municipalities")
@RequiredArgsConstructor
public class MunicipalityController {

    private final MunicipalityService municipalityService;

    // Público — se consume durante el onboarding (antes del registro)
    @GetMapping
    public ResponseEntity<ApiResponse<List<MunicipalityResponse>>> find(
            @RequestParam(required = false) String department,
            @RequestParam(required = false) String search) {
        return ResponseEntity.ok(ApiResponse.ok(municipalityService.find(department, search)));
    }
}