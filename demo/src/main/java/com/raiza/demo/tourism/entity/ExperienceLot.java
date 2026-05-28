package com.raiza.demo.tourism.entity;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "experience_lot")
@Getter
@Setter
@NoArgsConstructor
public class ExperienceLot extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "experience_id", nullable = false)
    private TourismExperience experience;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "lot_id", nullable = false)
    private ProductLot lot;

    @Column(name = "display_priority")
    private Integer displayPriority = 1;

    @Column(columnDefinition = "text")
    private String notes;
}
