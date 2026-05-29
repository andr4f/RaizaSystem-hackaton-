package com.raiza.demo.auth.dto;

import com.raiza.demo.producer.dto.CreateProducerRequest;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

/** Registro de un PRODUCTOR: credenciales de cuenta + datos de la entidad. */
public record RegisterProducerRequest(
        @NotBlank @Email @Size(max = 120) String email,
        @NotBlank @Size(min = 6, max = 100) String password,
        @Valid CreateProducerRequest profile
) {}
