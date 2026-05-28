package com.raiza.demo.certification.repository;

import com.raiza.demo.certification.entity.CertificationApplication;
import com.raiza.demo.shared.enums.CertificationApplicationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificationApplicationRepository extends JpaRepository<CertificationApplication, Long> {

    List<CertificationApplication> findByProducerId(Long producerId);

    List<CertificationApplication> findByStatus(CertificationApplicationStatus status);

    Optional<CertificationApplication> findByApplicationCode(String applicationCode);

    boolean existsByLotIdAndCertificationId(Long lotId, Long certificationId);
}
