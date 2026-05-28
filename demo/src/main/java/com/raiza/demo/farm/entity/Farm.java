package com.raiza.demo.farm.entity;

import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "farm")
@Getter
@Setter
@NoArgsConstructor
public class Farm extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "producer_id", nullable = false)
    private Producer producer;

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, length = 80)
    private String municipality;

    @Column(length = 80)
    private String corregimiento;

    @Column(precision = 10, scale = 7)
    private BigDecimal latitude;

    @Column(precision = 10, scale = 7)
    private BigDecimal longitude;

    @Column(name = "altitude_meters")
    private Integer altitudeMeters;

    @Column(name = "area_hectares", precision = 10, scale = 2)
    private BigDecimal areaHectares;

    @Column(name = "connectivity_level", length = 20)
    private String connectivityLevel;

    @Column(columnDefinition = "text")
    private String notes;
}
