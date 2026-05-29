package com.raiza.demo.tourism.repository;

import com.raiza.demo.tourism.entity.TourismExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TourismExperienceRepository extends JpaRepository<TourismExperience, Long> {

    Optional<TourismExperience> findByQrSlug(String qrSlug);

    List<TourismExperience> findByOperatorId(Long operatorId);
}
