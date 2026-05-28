package com.raiza.demo.lead.dto;

import com.raiza.demo.shared.enums.LeadStatus;
import jakarta.validation.constraints.NotNull;

public record UpdateLeadStatusRequest(
        @NotNull LeadStatus leadStatus
) {
}
