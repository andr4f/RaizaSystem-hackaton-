package com.raiza.demo.auth.repository;

import com.raiza.demo.auth.entity.AppUser;
import com.raiza.demo.shared.AbstractRepositoryTest;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

class AppUserRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private AppUserRepository appUserRepository;

    @Test
    void shouldFindById() {
        var user = appUserRepository.findById(1L);

        assertThat(user).isPresent();
        assertThat(user.get().getName()).isEqualTo("Admin Magdalena");
        assertThat(user.get().getEmail()).isEqualTo("admin@magdalena.co");
        assertThat(user.get().getRole()).isEqualTo("ADMIN");
        assertThat(user.get().isActive()).isTrue();
    }

    @Test
    void shouldFindByEmail() {
        Optional<AppUser> user = appUserRepository.findByEmail("admin@magdalena.co");

        assertThat(user).isPresent();
        assertThat(user.get().getName()).isEqualTo("Admin Magdalena");
    }

    @Test
    void shouldCheckExistsByEmail() {
        assertThat(appUserRepository.existsByEmail("admin@magdalena.co")).isTrue();
        assertThat(appUserRepository.existsByEmail("nonexistent@test.com")).isFalse();
    }

    @Test
    void shouldReturnEmptyForUnknownEmail() {
        Optional<AppUser> user = appUserRepository.findByEmail("unknown@test.com");

        assertThat(user).isEmpty();
    }

    @Test
    void shouldSaveNewUser() {
        AppUser user = new AppUser();
        user.setName("Test User");
        user.setEmail("test@magdalena.co");
        user.setPassword("password123");
        user.setRole("OPERATOR");
        user.setActive(true);

        AppUser saved = appUserRepository.save(user);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getEmail()).isEqualTo("test@magdalena.co");
        assertThat(appUserRepository.count()).isEqualTo(2);
    }
}
