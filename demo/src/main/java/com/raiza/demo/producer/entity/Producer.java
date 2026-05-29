package com.raiza.demo.producer.entity;

import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.ProducerType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "producer")
@Getter
@Setter
@NoArgsConstructor
public class Producer extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(name = "document_type", length = 20)
    private String documentType;

    @Column(name = "document_number", length = 50)
    private String documentNumber;

    @Enumerated(EnumType.STRING)
    @Column(name = "producer_type", nullable = false, length = 30)
    private ProducerType producerType;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(nullable = false, length = 80)
    private String municipality;

    @Column(length = 80)
    private String department = "Magdalena";

    @Column(name = "community_name", length = 120)
    private String communityName;

    // ── Respuestas del onboarding ─────────────────────────────────────────
    // Producto principal que cultiva (café / banano / cacao / otro)
    @Column(name = "main_product", length = 50)
    private String mainProduct;

    // Conocimiento sobre certificaciones: HAS / NONE / UNKNOWN
    @Column(name = "certification_awareness", length = 20)
    private String certificationAwareness;
}
