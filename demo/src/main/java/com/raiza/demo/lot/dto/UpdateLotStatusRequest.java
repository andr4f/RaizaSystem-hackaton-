package com.raiza.demo.lot.dto;

import com.raiza.demo.shared.enums.LotStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateLotStatusRequest(
        @NotNull LotStatus status,
        String note
) {
}
