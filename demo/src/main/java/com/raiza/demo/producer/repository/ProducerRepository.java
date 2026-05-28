package com.raiza.demo.producer.repository;

import com.raiza.demo.producer.entity.Producer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProducerRepository extends JpaRepository<Producer, Long> {

    Optional<Producer> findByDocumentNumber(String documentNumber);

    List<Producer> findByMunicipality(String municipality);
}
