package com.raiza.demo.auth.entity;

import com.raiza.demo.shared.BaseEntity;
import com.raiza.demo.shared.enums.UserRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "app_user")
@Getter
@Setter
@NoArgsConstructor
public class AppUser extends BaseEntity {

    @Column(nullable = false, length = 150)
    private String name;

    @Column(nullable = false, unique = true, length = 120)
    private String email;

    @Column(nullable = false)
    private String password;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 30)
    private UserRole role;

    @Column(nullable = false)
    private boolean active = true;

    @Column(name = "onboarding_completed", nullable = false)
    private boolean onboardingCompleted = false;

    // Enlace a la entidad de dominio que representa este usuario
    // (Producer / Exporter / TourismOperator / Buyer). El tipo lo indica profileType.
    @Column(name = "profile_id")
    private Long profileId;

    @Column(name = "profile_type", length = 30)
    private String profileType;
}
