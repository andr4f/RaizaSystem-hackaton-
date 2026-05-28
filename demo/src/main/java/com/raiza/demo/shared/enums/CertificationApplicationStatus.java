package com.raiza.demo.shared.enums;

public enum CertificationApplicationStatus {
    DRAFT,           // guardado sin enviar
    SUBMITTED,       // productor lo envió
    UNDER_REVIEW,    // admin o IA lo está revisando
    APPROVED,        // solicitud aprobada — procede a LotCertification
    REJECTED         // solicitud rechazada con notas
}
