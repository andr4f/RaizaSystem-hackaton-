package com.raiza.demo.shared.dto;

import java.util.List;

public record FinanceSummaryResponse(
        long negotiatedVolume,
        long activeDeals,
        long closedDeals,
        long pendingItems,
        List<FinanceLineItem> items
) {
    public static FinanceSummaryResponse empty() {
        return new FinanceSummaryResponse(0L, 0L, 0L, 0L, List.of());
    }
}
