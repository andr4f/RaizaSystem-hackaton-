package com.raiza.demo.exporter.entity;

import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "export_review")
@Getter
@Setter
@NoArgsConstructor
public class ExportReview extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lead_id", nullable = false)
    private PurchaseLead lead;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "exporter_id", nullable = false)
    private Exporter exporter;

    @Column(name = "review_status", nullable = false, length = 30)
    private String reviewStatus;

    @Column(columnDefinition = "text")
    private String notes;

    @Column(name = "estimated_delivery_date")
    private LocalDate estimatedDeliveryDate;

    @Column(length = 20)
    private String incoterm;
}
