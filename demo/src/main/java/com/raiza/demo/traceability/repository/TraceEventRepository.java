package com.raiza.demo.traceability.repository;

import com.raiza.demo.traceability.entity.TraceEvent;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface TraceEventRepository extends JpaRepository<TraceEvent, Long> {

    List<TraceEvent> findByLotIdOrderByEventTimestampAsc(Long lotId);

    Optional<TraceEvent> findFirstByLotIdOrderByIdDesc(Long lotId);
}
