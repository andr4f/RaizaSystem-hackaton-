package com.raiza.demo.publicview;

import com.raiza.demo.lead.repository.PurchaseLeadRepository;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.LotStatus;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.tourism.repository.ExperienceLotRepository;
import com.raiza.demo.tourism.repository.TourismExperienceRepository;
import com.raiza.demo.traceability.entity.TraceEvent;
import com.raiza.demo.traceability.repository.TraceEventRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

/**
 * Simula los escenarios reales del prototipo de cara al frontend:
 *  1. Usuario escanea QR → vista pública de trazabilidad
 *  2. Comprador ve el timeline completo del producto
 *  3. Turista visita experiencia agroecoturística vinculada al lote
 *  4. Comprador deja intención de compra desde la página QR
 *  5. Exportador filtra lotes disponibles
 */
class PublicTraceFlowRepositoryTest extends AbstractRepositoryTest {

    @Autowired ProductLotRepository lotRepository;
    @Autowired TraceEventRepository traceRepository;
    @Autowired TourismExperienceRepository experienceRepository;
    @Autowired ExperienceLotRepository experienceLotRepository;
    @Autowired PurchaseLeadRepository leadRepository;

    // ─── Escenario 1: escaneo de QR ─────────────────────────────────────────

    @Test
    void qrCode_resolvesCorrectLot() {
        var lot = lotRepository.findByQrCodeValue("qr-caf-minca-001");

        assertThat(lot).isPresent();
        assertThat(lot.get().getLotCode()).isEqualTo("CAF-MINCA-001");
        assertThat(lot.get().getStatus()).isEqualTo(LotStatus.AVAILABLE);
        assertThat(lot.get().getProduct().getName()).isEqualTo("Café Pergamino Seco");
    }

    @Test
    void qrCode_lotHasProducerAndFarm_forPublicCard() {
        ProductLot lot = lotRepository.findByQrCodeValue("qr-caf-minca-001").orElseThrow();

        assertThat(lot.getProducer().getName()).isEqualTo("Asociación de Caficultores de Minca");
        assertThat(lot.getProducer().getMunicipality()).isEqualTo("Minca");
        assertThat(lot.getFarm().getName()).isEqualTo("Finca El Mirador");
        assertThat(lot.getFarm().getAltitudeMeters()).isEqualTo(1450);
    }

    @Test
    void qrCode_farmHasCoordinates_forMapPin() {
        ProductLot lot = lotRepository.findByQrCodeValue("qr-caf-minca-001").orElseThrow();

        assertThat(lot.getFarm().getLatitude()).isNotNull();
        assertThat(lot.getFarm().getLongitude()).isNotNull();
    }

    @Test
    void invalidQrCode_returnsEmpty() {
        assertThat(lotRepository.findByQrCodeValue("qr-no-existe")).isEmpty();
    }

    // ─── Escenario 2: timeline público del producto ───────────────────────────

    @Test
    void timeline_showsFullProductJourney_inChronologicalOrder() {
        List<TraceEvent> events = traceRepository.findByLotIdOrderByEventTimestampAsc(1L);

        assertThat(events).extracting(TraceEvent::getEventType)
            .containsExactly(
                TraceEventType.LOT_CREATED,
                TraceEventType.HARVEST_COMPLETED,
                TraceEventType.QUALITY_CHECKED
            );
    }

    @Test
    void timeline_eventsHaveAllFieldsForPublicDisplay() {
        List<TraceEvent> events = traceRepository.findByLotIdOrderByEventTimestampAsc(1L);

        events.forEach(e -> {
            assertThat(e.getTitle()).as("evento %s sin título", e.getEventType()).isNotBlank();
            assertThat(e.getEventTimestamp()).isNotNull();
            assertThat(e.getHashValue()).as("evento %s sin hash", e.getEventType()).isNotBlank();
            assertThat(e.getActorType()).isNotNull();
        });
    }

    @Test
    void timeline_qualityEvent_showsScoreMetric() {
        TraceEvent qa = traceRepository.findById(3L).orElseThrow();

        assertThat(qa.getMetricName()).isEqualTo("quality_score");
        assertThat(qa.getMetricValue()).isEqualTo("88");
        assertThat(qa.getMetricUnit()).isEqualTo("points");
    }

    @Test
    void timeline_harvestEvent_showsHumidityMetric() {
        TraceEvent harvest = traceRepository.findById(2L).orElseThrow();

        assertThat(harvest.getMetricName()).isEqualTo("humidity");
        assertThat(harvest.getMetricValue()).isEqualTo("63");
        assertThat(harvest.getMetricUnit()).isEqualTo("%");
    }

    // ─── Escenario 3: experiencia agroecoturística ────────────────────────────

    @Test
    void tourismExperience_isFoundByOperator() {
        var experiences = experienceRepository.findByOperatorId(1L);

        assertThat(experiences).hasSize(1);
        assertThat(experiences.get(0).getTitle()).isEqualTo("Cata de Café en Minca");
        assertThat(experiences.get(0).getQrSlug()).isEqualTo("cata-cafe-minca");
    }

    @Test
    void tourismExperience_isLinkedToLot_forPublicPage() {
        var experienceLots = experienceLotRepository.findByExperienceIdOrderByDisplayPriorityAsc(1L);

        assertThat(experienceLots).hasSize(1);
        assertThat(experienceLots.get(0).getLot().getLotCode()).isEqualTo("CAF-MINCA-001");
    }

    @Test
    void tourismExperience_lotIsAvailable_canBeTraced() {
        var experienceLots = experienceLotRepository.findByExperienceIdOrderByDisplayPriorityAsc(1L);

        experienceLots.forEach(el ->
            assertThat(el.getLot().getStatus()).isEqualTo(LotStatus.AVAILABLE)
        );
    }

    // ─── Escenario 4: intención de compra desde página QR ────────────────────

    @Test
    void purchaseLead_isStoredWithBuyerData_linkedToLot() {
        var leads = leadRepository.findByLotId(1L);

        assertThat(leads).hasSize(1);
        assertThat(leads.get(0).getBuyer().getName()).isEqualTo("Laura Jensen");
        assertThat(leads.get(0).getDestinationCountry()).isEqualTo("Denmark");
        assertThat(leads.get(0).getRequestedQuantity().intValue()).isEqualTo(50);
        assertThat(leads.get(0).getSourceType()).isEqualTo("QR_SCAN");
    }

    @Test
    void purchaseLead_sourceReference_matchesQrCode() {
        var lead = leadRepository.findById(1L).orElseThrow();

        assertThat(lead.getSourceReference()).isEqualTo("qr-caf-minca-001");
    }

    // ─── Escenario 5: exportador filtra lotes disponibles ────────────────────

    @Test
    void availableLots_areQueryableByStatus() {
        List<ProductLot> available = lotRepository.findByStatus(LotStatus.AVAILABLE);

        assertThat(available).isNotEmpty();
        assertThat(available).allMatch(l -> l.getStatus() == LotStatus.AVAILABLE);
    }

    @Test
    void availableLots_allHaveQrCode_neededForSharing() {
        List<ProductLot> available = lotRepository.findByStatus(LotStatus.AVAILABLE);

        assertThat(available).allMatch(l -> l.getQrCodeValue() != null && !l.getQrCodeValue().isBlank());
    }

    @Test
    void producerLots_areQueryableByProducerId_forDashboard() {
        List<ProductLot> lots = lotRepository.findByProducerId(1L);

        assertThat(lots).hasSize(1);
        assertThat(lots.get(0).getLotCode()).isEqualTo("CAF-MINCA-001");
    }
}
