package com.raiza.demo.traceability.repository;

import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.traceability.entity.TraceEvent;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.time.LocalDateTime;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Verifica la integridad de la cadena de hashes (blockchain) en la capa de persistencia.
 * Simula los escenarios reales del prototipo: registro de lote, cosecha, QA y escaneo QR.
 */
class TraceabilityHashChainRepositoryTest extends AbstractRepositoryTest {

    @Autowired TraceEventRepository traceEventRepository;
    @Autowired ProductLotRepository productLotRepository;

    // ─── Integridad de la cadena ─────────────────────────────────────────────

    @Test
    void firstEvent_hasNoAncestor_chainStartsClean() {
        TraceEvent genesis = traceEventRepository.findById(1L).orElseThrow();

        assertThat(genesis.getEventType()).isEqualTo(TraceEventType.LOT_CREATED);
        assertThat(genesis.getPreviousHash()).isNull();
        assertThat(genesis.getHashValue()).isNotBlank();
    }

    @Test
    void eachEvent_previousHash_equalsHashOfImmediatePredecessor() {
        List<TraceEvent> chain = traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L);
        assertThat(chain).hasSizeGreaterThan(1);

        for (int i = 1; i < chain.size(); i++) {
            assertThat(chain.get(i).getPreviousHash())
                .as("Evento %d debería enlazar al hash del evento %d", i, i - 1)
                .isEqualTo(chain.get(i - 1).getHashValue());
        }
    }

    @Test
    void timeline_isChronologicallyOrdered() {
        List<TraceEvent> events = traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L);

        for (int i = 1; i < events.size(); i++) {
            assertThat(events.get(i).getEventTimestamp())
                .isAfterOrEqualTo(events.get(i - 1).getEventTimestamp());
        }
    }

    @Test
    void timeline_containsExpectedProductJourney() {
        List<TraceEvent> events = traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L);

        assertThat(events).extracting(TraceEvent::getEventType)
            .containsExactly(
                TraceEventType.LOT_CREATED,
                TraceEventType.HARVEST_COMPLETED,
                TraceEventType.QUALITY_CHECKED
            );
    }

    // ─── Datos de eventos para la vista pública ──────────────────────────────

    @Test
    void qualityCheck_carriesScoreMetric_neededForPublicCard() {
        TraceEvent qa = traceEventRepository.findById(3L).orElseThrow();

        assertThat(qa.getMetricName()).isEqualTo("quality_score");
        assertThat(qa.getMetricValue()).isEqualTo("88");
        assertThat(qa.getMetricUnit()).isEqualTo("points");
    }

    @Test
    void harvest_carriesHumidityMetric_neededForPublicCard() {
        TraceEvent harvest = traceEventRepository.findById(2L).orElseThrow();

        assertThat(harvest.getMetricName()).isEqualTo("humidity");
        assertThat(harvest.getMetricValue()).isEqualTo("63");
        assertThat(harvest.getMetricUnit()).isEqualTo("%");
    }

    @Test
    void events_haveGeoCoordinates_neededForMapView() {
        List<TraceEvent> events = traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L);

        events.forEach(e -> {
            assertThat(e.getLatitude()).as("Evento %s debería tener latitud", e.getEventType()).isNotNull();
            assertThat(e.getLongitude()).as("Evento %s debería tener longitud", e.getEventType()).isNotNull();
        });
    }

    @Test
    void allEvents_haveRequiredFieldsForPublicTimeline() {
        List<TraceEvent> events = traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L);

        events.forEach(e -> {
            assertThat(e.getTitle()).isNotBlank();
            assertThat(e.getEventTimestamp()).isNotNull();
            assertThat(e.getHashValue()).isNotBlank();
            assertThat(e.getActorType()).isNotNull();
        });
    }

    // ─── Escenario: escaneo QR agrega evento al final de la cadena ───────────

    @Test
    void qrScanEvent_isAppended_maintainingChainIntegrity() {
        TraceEvent lastEvent = traceEventRepository.findFirstByLotIdOrderByIdDesc(1L).orElseThrow();
        var lot = productLotRepository.findById(1L).orElseThrow();

        TraceEvent scan = new TraceEvent();
        scan.setLot(lot);
        scan.setEventType(TraceEventType.QR_SCANNED);
        scan.setEventTimestamp(LocalDateTime.now());
        scan.setActorType(ActorType.BUYER);
        scan.setTitle("QR escaneado por visitante en Minca");
        scan.setDescription("Turista escanea el QR del café Tabi en experiencia de cata");
        scan.setPreviousHash(lastEvent.getHashValue());
        scan.setHashValue("placeholder-for-service-generated-hash");

        TraceEvent saved = traceEventRepository.save(scan);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getPreviousHash()).isEqualTo(lastEvent.getHashValue());
        assertThat(traceEventRepository.findByLotIdOrderByEventTimestampAsc(1L)).hasSize(4);
    }
}
