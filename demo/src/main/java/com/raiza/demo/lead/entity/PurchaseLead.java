package com.raiza.demo.lead.entity;

import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.LeadStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "purchase_lead")
@Getter
@Setter
@NoArgsConstructor
public class PurchaseLead extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lot_id", nullable = false)
    private ProductLot lot;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "buyer_id", nullable = false)
    private Buyer buyer;

    @Column(name = "source_type", nullable = false, length = 30)
    private String sourceType;

    @Column(name = "source_reference", length = 120)
    private String sourceReference;

    @Column(name = "requested_quantity", precision = 12, scale = 2)
    private BigDecimal requestedQuantity;

    @Column(name = "unit_of_measure", length = 20)
    private String unitOfMeasure;

    @Column(name = "destination_country", length = 80)
    private String destinationCountry;

    @Column(columnDefinition = "text")
    private String message;

    @Enumerated(EnumType.STRING)
    @Column(name = "lead_status", nullable = false, length = 30)
    private LeadStatus leadStatus = LeadStatus.NEW;
}
