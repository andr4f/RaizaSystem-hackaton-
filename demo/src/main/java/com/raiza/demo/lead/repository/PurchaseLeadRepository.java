package com.raiza.demo.lead.repository;

import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.shared.enums.LeadStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PurchaseLeadRepository extends JpaRepository<PurchaseLead, Long> {

    List<PurchaseLead> findByLeadStatus(LeadStatus leadStatus);

    List<PurchaseLead> findByLotId(Long lotId);

    List<PurchaseLead> findAllByOrderByCreatedAtDesc();

    List<PurchaseLead> findByLot_Producer_IdOrderByCreatedAtDesc(Long producerId);

    List<PurchaseLead> findByLotIdIn(List<Long> lotIds);

    List<PurchaseLead> findByLotIdInOrderByCreatedAtDesc(List<Long> lotIds);

    @Query("""
            SELECT pl FROM PurchaseLead pl
            WHERE pl.id IN (
                SELECT er.lead.id FROM ExportReview er WHERE er.exporter.id = :exporterId
            )
            ORDER BY pl.createdAt DESC
            """)
    List<PurchaseLead> findByExporterId(@Param("exporterId") Long exporterId);
}
