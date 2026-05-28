package com.raiza.demo.farm.repository;

import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.repository.ProducerRepository;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.ProducerType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class FarmRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private FarmRepository farmRepository;

    @Autowired
    private ProducerRepository producerRepository;

    @Test
    void shouldFindById() {
        var farm = farmRepository.findById(1L);

        assertThat(farm).isPresent();
        assertThat(farm.get().getName()).isEqualTo("Finca El Mirador");
        assertThat(farm.get().getMunicipality()).isEqualTo("Minca");
        assertThat(farm.get().getAltitudeMeters()).isEqualTo(1450);
    }

    @Test
    void shouldFindByProducerId() {
        List<Farm> farms = farmRepository.findByProducerId(1L);

        assertThat(farms).hasSize(1);
        assertThat(farms.get(0).getCorregimiento()).isEqualTo("La Tagua");
    }

    @Test
    void shouldReturnAllFarms() {
        List<Farm> farms = farmRepository.findAll();

        assertThat(farms).hasSize(1);
    }

    @Test
    void shouldSaveNewFarm() {
        Producer producer = producerRepository.findById(1L).orElseThrow();

        Farm farm = new Farm();
        farm.setProducer(producer);
        farm.setName("Finca El Progreso");
        farm.setMunicipality("Santa Marta");

        Farm saved = farmRepository.save(farm);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Finca El Progreso");
        assertThat(farmRepository.count()).isEqualTo(2);
    }
}
