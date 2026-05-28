package com.raiza.demo.certification.entity;

import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.CertificationApplicationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "certification_application")
@Getter
@Setter
@NoArgsConstructor
public class CertificationApplication extends BaseEntity {

    @Column(name = "application_code", nullable = false, unique = true, length = 40)
    private String applicationCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producer_id", nullable = false)
    private Producer producer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lot_id", nullable = false)
    private ProductLot lot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CertificationApplicationStatus status = CertificationApplicationStatus.DRAFT;

    // JSON completo del documento — para regenerar el PDF sin tocar otras tablas
    @Column(name = "payload_json", nullable = false, columnDefinition = "text")
    private String payloadJson;

    // Ruta del PDF generado (relativa al storage configurado)
    @Column(name = "pdf_path")
    private String pdfPath;

    @Column(name = "destination_email", length = 120)
    private String destinationEmail;

    @Column(name = "recommended_by_ai")
    private Boolean recommendedByAi;

    @Column(name = "review_notes", columnDefinition = "text")
    private String reviewNotes;

    @Column(name = "reviewed_by")
    private Long reviewedBy;
}
