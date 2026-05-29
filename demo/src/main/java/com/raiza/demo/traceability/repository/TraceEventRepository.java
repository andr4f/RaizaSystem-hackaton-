package com.raiza.demo.traceability.repository;

import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.traceability.entity.TraceEvent;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface TraceEventRepository extends JpaRepository<TraceEvent, Long> {

    List<TraceEvent> findByLotIdOrderByEventTimestampAsc(Long lotId);

    Optional<TraceEvent> findFirstByLotIdOrderByIdDesc(Long lotId);

    @Query("""
            SELECT COUNT(te) FROM TraceEvent te
            JOIN te.lot l
            WHERE l.producer.id = :producerId
              AND te.eventType = :eventType
            """)
    long countByProducerIdAndEventType(@Param("producerId") Long producerId,
                                       @Param("eventType") TraceEventType eventType);

    @Query("""
            SELECT COUNT(te) FROM TraceEvent te
            JOIN te.lot l
            WHERE l.producer.id = :producerId
              AND te.eventType = :eventType
              AND te.eventTimestamp >= :from
              AND te.eventTimestamp < :to
            """)
    long countByProducerIdAndEventTypeBetween(@Param("producerId") Long producerId,
                                              @Param("eventType") TraceEventType eventType,
                                              @Param("from") LocalDateTime from,
                                              @Param("to") LocalDateTime to);

    @Query("""
            SELECT COUNT(te) FROM TraceEvent te
            WHERE te.lot.id IN :lotIds
              AND te.eventType = :eventType
            """)
    long countByLotIdsAndEventType(@Param("lotIds") List<Long> lotIds,
                                   @Param("eventType") TraceEventType eventType);

    @Query("""
            SELECT COUNT(te) FROM TraceEvent te
            WHERE te.lot.id IN :lotIds
              AND te.eventType = :eventType
              AND te.eventTimestamp >= :from
              AND te.eventTimestamp < :to
            """)
    long countByLotIdsAndEventTypeBetween(@Param("lotIds") List<Long> lotIds,
                                          @Param("eventType") TraceEventType eventType,
                                          @Param("from") LocalDateTime from,
                                          @Param("to") LocalDateTime to);

    @Query(value = """
            SELECT TO_CHAR(te.event_timestamp, 'YYYY-MM') AS month, COUNT(*) AS total
            FROM trace_event te
            JOIN product_lot pl ON pl.id = te.lot_id
            WHERE pl.producer_id = :producerId
              AND te.event_type = :eventType
              AND te.event_timestamp >= :since
            GROUP BY month
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> countMonthlyByProducerAndEventType(@Param("producerId") Long producerId,
                                                      @Param("eventType") String eventType,
                                                      @Param("since") LocalDateTime since);

    @Query(value = """
            SELECT TO_CHAR(te.event_timestamp, 'YYYY-MM') AS month, COUNT(*) AS total
            FROM trace_event te
            JOIN purchase_lead pl ON pl.lot_id = te.lot_id
            JOIN export_review er ON er.lead_id = pl.id
            WHERE er.exporter_id = :exporterId
              AND te.event_type = :eventType
              AND te.event_timestamp >= :since
            GROUP BY month
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> countMonthlyByExporterAndEventType(@Param("exporterId") Long exporterId,
                                                      @Param("eventType") String eventType,
                                                      @Param("since") LocalDateTime since);

    @Query(value = """
            SELECT TO_CHAR(te.event_timestamp, 'YYYY-MM') AS month, COUNT(*) AS total
            FROM trace_event te
            WHERE te.lot_id IN (:lotIds)
              AND te.event_type = :eventType
              AND te.event_timestamp >= :since
            GROUP BY month
            ORDER BY month
            """, nativeQuery = true)
    List<Object[]> countMonthlyByLotIdsAndEventType(@Param("lotIds") List<Long> lotIds,
                                                    @Param("eventType") String eventType,
                                                    @Param("since") LocalDateTime since);

    @Query("""
            SELECT te FROM TraceEvent te
            WHERE te.lot.id IN :lotIds
              AND te.eventType IN :eventTypes
            ORDER BY te.eventTimestamp DESC
            """)
    List<TraceEvent> findByLotIdsAndEventTypeInOrderByEventTimestampDesc(
            @Param("lotIds") List<Long> lotIds,
            @Param("eventTypes") List<TraceEventType> eventTypes);
}
