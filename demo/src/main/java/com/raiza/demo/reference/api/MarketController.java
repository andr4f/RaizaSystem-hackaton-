package com.raiza.demo.reference.api;

import com.raiza.demo.shared.dto.ReferenceItem;
import com.raiza.demo.shared.enums.ExportMarket;
import com.raiza.demo.shared.response.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/v1/markets")
public class MarketController {

    // Público — catálogo de mercados de exportación para el onboarding
    @GetMapping
    public ResponseEntity<ApiResponse<List<ReferenceItem>>> findAll() {
        return ResponseEntity.ok(ApiResponse.ok(ExportMarket.asItems()));
    }
}
