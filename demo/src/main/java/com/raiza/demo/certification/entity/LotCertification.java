package com.raiza.demo.certification.entity;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.CertificationValidationStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "lot_certification")
@Getter
@Setter
@NoArgsConstructor
public class LotCertification extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lot_id", nullable = false)
    private ProductLot lot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "certification_id", nullable = false)
    private Certification certification;

    @Column(name = "certificate_code", length = 80)
    private String certificateCode;

    @Column(name = "valid_from")
    private LocalDate validFrom;

    @Column(name = "valid_to")
    private LocalDate validTo;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private CertificationValidationStatus status = CertificationValidationStatus.PENDING_VALIDATION;

    @Column(name = "evidence_url", columnDefinition = "text")
    private String evidenceUrl;

    @Column(name = "validation_notes", columnDefinition = "text")
    private String validationNotes;

    @Column(name = "validated_by")
    private Long validatedBy;

    @Column(name = "validated_at")
    private LocalDateTime validatedAt;
}
