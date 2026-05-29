package com.raiza.demo.certification.entity;

import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.certification.enums.Certifier;
import com.raiza.demo.certification.enums.CertificationStatus;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "certifications")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Certification extends BaseEntity {

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @Enumerated(EnumType.STRING)
    @Column(name = "certifier", nullable = false, length = 50)
    private Certifier certifier;

    @Column(name = "name", nullable = false, length = 150)
    private String name;

    @Column(name = "certificate_number", nullable = false, length = 100)
    private String certificateNumber;

    @Column(name = "issued_at", nullable = false)
    private LocalDate issuedAt;

    @Column(name = "expires_at")
    private LocalDate expiresAt;

    @Column(name = "verification_url", length = 500)
    private String verificationUrl;

    @Column(name = "document_path", length = 500)
    private String documentPath;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    private CertificationStatus status;

    @Column(name = "registered_at", nullable = false, updatable = false)
    private LocalDateTime registeredAt;

    @Column(name = "registered_by", nullable = false, updatable = false)
    private String registeredBy;

    @PrePersist
    public void prePersist() {
        this.registeredAt = LocalDateTime.now();
        this.status = calculateStatus();
    }

    @PreUpdate
    public void preUpdate() {
        this.status = calculateStatus();
    }

    public CertificationStatus calculateStatus() {
        LocalDate today = LocalDate.now();
        if (expiresAt == null)                      return CertificationStatus.PENDING;
        if (expiresAt.isBefore(today))              return CertificationStatus.EXPIRED;
        if (expiresAt.isBefore(today.plusDays(30))) return CertificationStatus.EXPIRING_SOON;
        return CertificationStatus.ACTIVE;
    }
}
