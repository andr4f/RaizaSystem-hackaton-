package com.raiza.demo.lot.repository;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.shared.enums.LotStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ProductLotRepository extends JpaRepository<ProductLot, Long> {

    Optional<ProductLot> findByLotCode(String lotCode);

    Optional<ProductLot> findByQrCodeValue(String qrCodeValue);

    boolean existsByLotCode(String lotCode);

    List<ProductLot> findByStatus(LotStatus status);

    List<ProductLot> findByProducerId(Long producerId);
}
