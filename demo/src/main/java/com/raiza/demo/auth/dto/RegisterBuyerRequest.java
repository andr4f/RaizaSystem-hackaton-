package com.raiza.demo.auth.dto;

import com.raiza.demo.shared.enums.BuyerType;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

/** Registro de un COMPRADOR / CONSUMIDOR: credenciales + datos del comprador. */
public record RegisterBuyerRequest(
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @NotNull BuyerType buyerType,
        @NotBlank @Size(max = 120) String name,
        @Size(max = 150) String companyName,
        @Size(max = 80) String country,
        @Size(max = 30) String phone,
        @Size(max = 20) String preferredLanguage
) {}
