package com.raiza.demo.buyer.entity;

import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.BuyerType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "buyer")
@Getter
@Setter
@NoArgsConstructor
public class Buyer extends BaseEntity {

    @Enumerated(EnumType.STRING)
    @Column(name = "buyer_type", nullable = false, length = 30)
    private BuyerType buyerType;

    @Column(nullable = false, length = 120)
    private String name;

    @Column(name = "company_name", length = 150)
    private String companyName;

    @Column(length = 80)
    private String country;

    @Column(length = 30)
    private String phone;

    @Column(length = 120)
    private String email;

    @Column(name = "preferred_language", length = 20)
    private String preferredLanguage;
}
