package com.raiza.demo.lot.entity;

import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.product.entity.Product;
import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.LotStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@Table(name = "product_lot")
@Getter
@Setter
@NoArgsConstructor
public class ProductLot extends BaseEntity {

    @Column(name = "lot_code", nullable = false, unique = true, length = 50)
    private String lotCode;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producer_id", nullable = false)
    private Producer producer;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "farm_id", nullable = false)
    private Farm farm;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "harvest_date")
    private LocalDate harvestDate;

    @Column(name = "available_quantity", nullable = false, precision = 12, scale = 2)
    private BigDecimal availableQuantity;

    @Column(name = "unit_of_measure", nullable = false, length = 20)
    private String unitOfMeasure;

    @Column(name = "process_type", length = 50)
    private String processType;

    @Column(name = "cultivation_conditions", columnDefinition = "text")
    private String cultivationConditions;

    @Column(name = "quality_grade", length = 50)
    private String qualityGrade;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private LotStatus status = LotStatus.AVAILABLE;

    @Column(name = "blockchain_reference", length = 120)
    private String blockchainReference;

    @Column(name = "qr_code_value", length = 150)
    private String qrCodeValue;
}
