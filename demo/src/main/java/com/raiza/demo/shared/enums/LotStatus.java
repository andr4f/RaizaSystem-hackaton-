package com.raiza.demo.shared.enums;

public enum LotStatus {
    CERTIFICATION_PENDING, // lote creado, sin certificación validada aún
    AVAILABLE,             // al menos una certificación validada — exportable
    RESERVED,              // reservado por un lead activo
    IN_EXPORT_REVIEW,      // en proceso de revisión exportadora
    SOLD,
    INACTIVE
}
