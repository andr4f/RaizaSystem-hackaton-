package com.raiza.demo.shared.enums;

public enum CertificationValidationStatus {
    PENDING_VALIDATION,    // recién subida, esperando revisión
    CONDITIONALLY_VALID,   // IA la aprueba provisionalmente
    VALIDATED,             // admin la aprueba definitivamente
    REJECTED,              // no cumple requisitos
    EXPIRED                // venció la fecha de validez
}
