package com.raiza.demo.traceability.repository;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.traceability.entity.TraceEvent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class TraceEventRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private TraceEventRepository traceEventRepository;

    @Autowired
    private ProductLotRepository productLotRepository;

    @Test
    void shouldFindById() {
        var event = traceEventRepository.findById(1L);

        assertThat(event).isPresent();
        assertThat(event.get().getEventType()).isEqualTo(TraceEventType.LOT_CREATED);
        assertThat(event.get().getTitle()).isEqualTo("Lote registrado");
    }

    @Test
    void shouldFindByLotIdOrderByEventTimestampAsc() {
        List<TraceEvent> events = traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L);

        assertThat(events).hasSize(3);
        assertThat(events.get(0).getEventType()).isEqualTo(TraceEventType.LOT_CREATED);
        assertThat(events.get(1).getEventType()).isEqualTo(TraceEventType.HARVEST_COMPLETED);
        assertThat(events.get(2).getEventType()).isEqualTo(TraceEventType.QUALITY_CHECKED);
    }

    @Test
    void shouldFindFirstByLotIdOrderByIdDesc() {
        Optional<TraceEvent> lastEvent = traceEventRepository.findFirstByLotIdOrderByIdDesc(1L);

        assertThat(lastEvent).isPresent();
        assertThat(lastEvent.get().getEventType()).isEqualTo(TraceEventType.QUALITY_CHECKED);
        assertThat(lastEvent.get().getHashValue()).isEqualTo("ghi789jkl");
    }

    @Test
    void shouldReturnEmptyWhenNoEventsForLot() {
        List<TraceEvent> events = traceEventRepository.findByLotIdOrderByEventTimestampAsc(999L);

        assertThat(events).isEmpty();
    }

    @Test
    void shouldSaveNewTraceEvent() {
        ProductLot lot = productLotRepository.findById(1L).orElseThrow();

        TraceEvent event = new TraceEvent();
        event.setLot(lot);
        event.setEventType(TraceEventType.TOURISM_LINKED);
        event.setEventTimestamp(LocalDateTime.now());
        event.setActorType(ActorType.TOURISM_OPERATOR);
        event.setActorId(1L);
        event.setTitle("Experiencia turística vinculada");
        event.setDescription("Lote vinculado a experiencia de cata");

        TraceEvent saved = traceEventRepository.save(event);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getEventType()).isEqualTo(TraceEventType.TOURISM_LINKED);
        assertThat(traceEventRepository.count()).isEqualTo(4);
    }
}
