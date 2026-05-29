package com.raiza.demo.shared.dto;

import java.time.LocalDateTime;

public record FinanceLineItem(
        String category,
        String label,
        String detail,
        long volume,
        String status,
        LocalDateTime date
) {
}
