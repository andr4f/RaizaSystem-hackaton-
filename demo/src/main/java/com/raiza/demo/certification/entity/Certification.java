package com.raiza.demo.certification.entity;

import com.raiza.demo.shared.BaseEntity;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "certification")
@Getter
@Setter
@NoArgsConstructor
public class Certification extends BaseEntity {

    @Column(nullable = false, length = 100)
    private String name;

    @Column(length = 120)
    private String issuer;

    @Column(columnDefinition = "text")
    private String description;
}
