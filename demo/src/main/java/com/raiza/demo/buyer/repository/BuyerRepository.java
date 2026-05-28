package com.raiza.demo.buyer.repository;

import com.raiza.demo.buyer.entity.Buyer;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BuyerRepository extends JpaRepository<Buyer, Long> {

    Optional<Buyer> findByEmail(String email);
}
