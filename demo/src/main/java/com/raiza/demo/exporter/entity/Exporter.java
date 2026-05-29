package com.raiza.demo.exporter.entity;

import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "exporter")
@Getter
@Setter
@NoArgsConstructor
public class Exporter extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(name = "registration_code", length = 80)
    private String registrationCode;

    @Column(name = "contact_name", length = 120)
    private String contactName;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(length = 80)
    private String municipality;

    // ── Respuestas del onboarding ─────────────────────────────────────────
    // Mercados a los que exporta (lista separada por comas: EUROPA,ASIA,...)
    @Column(length = 255)
    private String markets;

    // Productos que maneja (lista separada por comas: CAFE,CACAO,...)
    @Column(name = "handled_products", length = 255)
    private String handledProducts;

    // Rango de volumen mensual en toneladas
    @Column(name = "monthly_volume_range", length = 40)
    private String monthlyVolumeRange;
}
