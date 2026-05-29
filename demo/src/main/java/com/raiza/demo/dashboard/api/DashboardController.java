package com.raiza.demo.dashboard.api;

import com.raiza.demo.dashboard.dto.DashboardStatsResponse;
import com.raiza.demo.dashboard.service.DashboardService;
import com.raiza.demo.security.model.UserPrincipal;
import com.raiza.demo.shared.response.ApiResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/v1/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;

    @GetMapping("/stats")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<ApiResponse<DashboardStatsResponse>> stats(
            @AuthenticationPrincipal UserPrincipal principal) {
        return ResponseEntity.ok(ApiResponse.ok(dashboardService.getStats(principal.getUser())));
    }
}
