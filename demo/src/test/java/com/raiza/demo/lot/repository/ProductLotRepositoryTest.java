package com.raiza.demo.lot.repository;

import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.farm.repository.FarmRepository;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.repository.ProducerRepository;
import com.raiza.demo.product.entity.Product;
import com.raiza.demo.product.repository.ProductRepository;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.LotStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class ProductLotRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private ProductLotRepository productLotRepository;

    @Autowired
    private ProducerRepository producerRepository;

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private ProductRepository productRepository;

    @Test
    void shouldFindById() {
        var lot = productLotRepository.findById(1L);

        assertThat(lot).isPresent();
        assertThat(lot.get().getLotCode()).isEqualTo("CAF-MINCA-001");
        assertThat(lot.get().getStatus()).isEqualTo(LotStatus.AVAILABLE);
        assertThat(lot.get().getAvailableQuantity()).isEqualByComparingTo(new BigDecimal("250.00"));
    }

    @Test
    void shouldFindByLotCode() {
        Optional<ProductLot> lot = productLotRepository.findByLotCode("CAF-MINCA-001");

        assertThat(lot).isPresent();
        assertThat(lot.get().getProcessType()).isEqualTo("lavado");
    }

    @Test
    void shouldFindByQrCodeValue() {
        Optional<ProductLot> lot = productLotRepository.findByQrCodeValue("qr-caf-minca-001");

        assertThat(lot).isPresent();
        assertThat(lot.get().getLotCode()).isEqualTo("CAF-MINCA-001");
    }

    @Test
    void shouldCheckExistsByLotCode() {
        assertThat(productLotRepository.existsByLotCode("CAF-MINCA-001")).isTrue();
        assertThat(productLotRepository.existsByLotCode("NONEXISTENT")).isFalse();
    }

    @Test
    void shouldFindByStatus() {
        List<ProductLot> lots = productLotRepository.findByStatus(LotStatus.AVAILABLE);

        assertThat(lots).hasSize(1);
    }

    @Test
    void shouldFindByProducerId() {
        List<ProductLot> lots = productLotRepository.findByProducerId(1L);

        assertThat(lots).hasSize(1);
        assertThat(lots.get(0).getLotCode()).isEqualTo("CAF-MINCA-001");
    }

    @Test
    void shouldReturnEmptyForUnknownStatus() {
        List<ProductLot> lots = productLotRepository.findByStatus(LotStatus.SOLD);

        assertThat(lots).isEmpty();
    }

    @Test
    void shouldSaveNewLot() {
        Producer producer = producerRepository.findById(1L).orElseThrow();
        Farm farm = farmRepository.findById(1L).orElseThrow();
        Product product = productRepository.findById(1L).orElseThrow();

        ProductLot lot = new ProductLot();
        lot.setLotCode("CAF-MINCA-002");
        lot.setProducer(producer);
        lot.setFarm(farm);
        lot.setProduct(product);
        lot.setHarvestDate(LocalDate.of(2026, 5, 20));
        lot.setAvailableQuantity(new BigDecimal("100.00"));
        lot.setUnitOfMeasure("kg");
        lot.setStatus(LotStatus.AVAILABLE);

        ProductLot saved = productLotRepository.save(lot);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getLotCode()).isEqualTo("CAF-MINCA-002");
        assertThat(productLotRepository.count()).isEqualTo(2);
    }
}
