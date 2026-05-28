package com.raiza.demo.farm.repository;

import com.raiza.demo.farm.entity.Farm;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface FarmRepository extends JpaRepository<Farm, Long> {

    List<Farm> findByProducerId(Long producerId);
}
