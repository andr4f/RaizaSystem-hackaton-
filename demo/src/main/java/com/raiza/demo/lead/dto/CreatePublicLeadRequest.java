package com.raiza.demo.lead.dto;

import com.raiza.demo.shared.enums.BuyerType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.math.BigDecimal;

public record CreatePublicLeadRequest(
        @NotNull Long lotId,
        @NotNull BuyerType buyerType,
        @NotBlank @Size(max = 120) String buyerName,
        @Size(max = 150) String companyName,
        @Size(max = 80) String country,
        @Size(max = 30) String phone,
        @Size(max = 120) String email,
        @Size(max = 20) String preferredLanguage,
        BigDecimal requestedQuantity,
        @Size(max = 20) String unitOfMeasure,
        @Size(max = 80) String destinationCountry,
        String message,
        @Size(max = 30) String sourceType,
        @Size(max = 120) String sourceReference
) {
}
