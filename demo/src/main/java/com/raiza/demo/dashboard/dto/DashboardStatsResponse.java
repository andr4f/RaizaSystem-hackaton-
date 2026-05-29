package com.raiza.demo.dashboard.dto;

import java.util.List;

public record DashboardStatsResponse(
        Long activeLots,
        Long qrScans,
        Long qrScansThisMonth,
        Long certifications,
        Long opportunities,
        Long verifiedLots,
        Long orders,
        Long volume,
        Long experiences,
        Long visits,
        Long visitsThisMonth,
        Long bookings,
        Long allies,
        Long linkedLots,
        Double qrScansTrendPct,
        Double visitsTrendPct,
        List<TimeSeriesPoint> series
) {
    public static DashboardStatsResponse empty() {
        return new DashboardStatsResponse(
                0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L, 0L,
                null, null, List.of());
    }
}
