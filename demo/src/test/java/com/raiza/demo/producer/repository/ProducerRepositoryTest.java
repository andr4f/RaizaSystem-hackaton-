package com.raiza.demo.producer.repository;

import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.ProducerType;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class ProducerRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private ProducerRepository producerRepository;

    @Test
    void shouldFindById() {
        Optional<Producer> producer = producerRepository.findById(1L);

        assertThat(producer).isPresent();
        assertThat(producer.get().getName()).isEqualTo("Asociación de Caficultores de Minca");
        assertThat(producer.get().getProducerType()).isEqualTo(ProducerType.ASOCIACION);
        assertThat(producer.get().getMunicipality()).isEqualTo("Minca");
    }

    @Test
    void shouldFindByDocumentNumber() {
        Optional<Producer> producer = producerRepository.findByDocumentNumber("900123456-7");

        assertThat(producer).isPresent();
        assertThat(producer.get().getEmail()).isEqualTo("contacto@cafeminca.co");
    }

    @Test
    void shouldFindByMunicipality() {
        List<Producer> producers = producerRepository.findByMunicipality("Minca");

        assertThat(producers).hasSize(1);
        assertThat(producers.get(0).getCommunityName()).isEqualTo("Asociación de productores de Minca");
    }

    @Test
    void shouldReturnAllProducers() {
        List<Producer> producers = producerRepository.findAll();

        assertThat(producers).hasSize(1);
    }

    @Test
    void shouldSaveNewProducer() {
        Producer producer = new Producer();
        producer.setName("Nuevo Productor");
        producer.setProducerType(ProducerType.INDIVIDUAL);
        producer.setMunicipality("Santa Marta");
        producer.setDepartment("Magdalena");

        Producer saved = producerRepository.save(producer);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getName()).isEqualTo("Nuevo Productor");
        assertThat(producerRepository.count()).isEqualTo(2);
    }
}
