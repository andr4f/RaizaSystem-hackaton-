package com.raiza.demo.tourism.repository;

import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.tourism.entity.TourismExperience;
import com.raiza.demo.tourism.entity.TourismOperator;
import com.raiza.demo.tourism.repository.TourismOperatorRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class TourismExperienceRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private TourismExperienceRepository tourismExperienceRepository;

    @Autowired
    private TourismOperatorRepository tourismOperatorRepository;

    @Test
    void shouldFindById() {
        var experience = tourismExperienceRepository.findById(1L);

        assertThat(experience).isPresent();
        assertThat(experience.get().getTitle()).isEqualTo("Cata de Café en Minca");
        assertThat(experience.get().getLocationName()).isEqualTo("Finca El Mirador - Minca");
    }

    @Test
    void shouldFindByQrSlug() {
        Optional<TourismExperience> experience = tourismExperienceRepository.findByQrSlug("cata-cafe-minca");

        assertThat(experience).isPresent();
        assertThat(experience.get().getTitle()).isEqualTo("Cata de Café en Minca");
    }

    @Test
    void shouldReturnEmptyForUnknownSlug() {
        Optional<TourismExperience> experience = tourismExperienceRepository.findByQrSlug("unknown-slug");

        assertThat(experience).isEmpty();
    }

    @Test
    void shouldSaveNewExperience() {
        TourismOperator operator = tourismOperatorRepository.findById(1L).orElseThrow();

        TourismExperience experience = new TourismExperience();
        experience.setOperator(operator);
        experience.setTitle("Visita a Finca Cafetera");
        experience.setLocationName("Minca");
        experience.setQrSlug("visita-finca-minca");

        TourismExperience saved = tourismExperienceRepository.save(experience);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getTitle()).isEqualTo("Visita a Finca Cafetera");
        assertThat(tourismExperienceRepository.count()).isEqualTo(2);
    }
}
