package com.raiza.demo.tourism.entity;

import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tourism_operator")
@Getter
@Setter
@NoArgsConstructor
public class TourismOperator extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "operator_type", nullable = false, length = 50)
    private String operatorType;

    @Column(name = "contact_name", length = 120)
    private String contactName;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(length = 80)
    private String municipality;

    @Column(length = 200)
    private String website;

    // ── Respuestas del onboarding ─────────────────────────────────────────
    // Tipos de experiencia que ofrece (lista separada por comas: TOUR_FINCA,CATA,...)
    @Column(name = "experience_types", length = 255)
    private String experienceTypes;

    // ¿Trabaja con productores locales? YES / NO / STARTING
    @Column(name = "works_with_local_producers", length = 20)
    private String worksWithLocalProducers;

    // Rango estimado de visitantes al mes
    @Column(name = "monthly_visitors_range", length = 40)
    private String monthlyVisitorsRange;
}
