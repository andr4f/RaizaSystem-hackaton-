package com.raiza.demo.exporter.repository;

import com.raiza.demo.exporter.entity.Exporter;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ExporterRepository extends JpaRepository<Exporter, Long> {

    Optional<Exporter> findByRegistrationCode(String registrationCode);
}
