package com.raiza.demo.tourism.repository;

import com.raiza.demo.tourism.entity.ExperienceLot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExperienceLotRepository extends JpaRepository<ExperienceLot, Long> {

    List<ExperienceLot> findByExperienceIdOrderByDisplayPriorityAsc(Long experienceId);

    List<ExperienceLot> findByLotId(Long lotId);
}
