package com.raiza.demo.tourism.entity;

import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "tourism_experience")
@Getter
@Setter
@NoArgsConstructor
public class TourismExperience extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "operator_id", nullable = false)
    private TourismOperator operator;

    @Column(nullable = false, length = 150)
    private String title;

    @Column(name = "location_name", length = 150)
    private String locationName;

    @Column(columnDefinition = "text")
    private String description;

    @Column(name = "qr_slug", unique = true, length = 120)
    private String qrSlug;
}
