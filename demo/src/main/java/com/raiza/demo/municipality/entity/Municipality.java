package com.raiza.demo.municipality.entity;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "municipality")
@Getter
@Setter
@NoArgsConstructor
public class Municipality {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(nullable = false, length = 80)
    private String department;

    // Subregión del Magdalena (Norte, Río, Centro, Sur...) — útil para agrupar
    @Column(length = 80)
    private String subregion;

    // Código oficial DANE
    @Column(name = "dane_code", length = 10)
    private String daneCode;
}