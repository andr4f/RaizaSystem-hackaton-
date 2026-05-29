package com.raiza.demo.lead.repository;

import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.shared.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PurchaseLeadRepository extends JpaRepository<PurchaseLead, Long> {

    List<PurchaseLead> findByLeadStatus(LeadStatus leadStatus);

    List<PurchaseLead> findByLotId(Long lotId);

    List<PurchaseLead> findAllByOrderByCreatedAtDesc();

    List<PurchaseLead> findByLot_Producer_IdOrderByCreatedAtDesc(Long producerId);
}
