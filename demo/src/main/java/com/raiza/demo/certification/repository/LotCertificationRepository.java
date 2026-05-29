package com.raiza.demo.certification.repository;

import com.raiza.demo.certification.entity.LotCertification;
import com.raiza.demo.shared.enums.CertificationValidationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LotCertificationRepository extends JpaRepository<LotCertification, Long> {

    List<LotCertification> findByLotId(Long lotId);

    boolean existsByLotIdAndCertificationId(Long lotId, Long certificationId);

    boolean existsByLotIdAndStatusIn(Long lotId, List<CertificationValidationStatus> statuses);

    long countByLot_Producer_IdAndStatus(Long producerId, CertificationValidationStatus status);
}
