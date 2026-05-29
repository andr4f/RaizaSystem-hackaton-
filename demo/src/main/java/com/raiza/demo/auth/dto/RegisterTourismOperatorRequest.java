package com.raiza.demo.auth.dto;

import com.raiza.demo.tourism.dto.CreateTourismOperatorRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Registro de un OPERADOR TURÍSTICO: credenciales de cuenta + datos de la entidad. */
public record RegisterTourismOperatorRequest(
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @Valid CreateTourismOperatorRequest profile
) {}
