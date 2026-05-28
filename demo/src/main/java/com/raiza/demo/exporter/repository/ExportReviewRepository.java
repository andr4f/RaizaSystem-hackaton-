package com.raiza.demo.exporter.repository;

import com.raiza.demo.exporter.entity.ExportReview;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ExportReviewRepository extends JpaRepository<ExportReview, Long> {

    List<ExportReview> findByLeadId(Long leadId);

    List<ExportReview> findByExporterId(Long exporterId);
}
