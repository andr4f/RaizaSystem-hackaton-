package com.raiza.demo.buyer.service;

import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.buyer.repository.BuyerRepository;
import com.raiza.demo.shared.enums.BuyerType;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

@Service
@RequiredArgsConstructor
public class BuyerService {

    private final BuyerRepository buyerRepository;

    @Transactional
    public Buyer findOrCreate(BuyerType buyerType, String name, String companyName, String country,
                              String phone, String email, String preferredLanguage) {
        if (StringUtils.hasText(email)) {
            return buyerRepository.findByEmail(email)
                    .orElseGet(() -> create(buyerType, name, companyName, country, phone, email, preferredLanguage));
        }
        return create(buyerType, name, companyName, country, phone, email, preferredLanguage);
    }

    @Transactional(readOnly = true)
    public Buyer getBuyerOrThrow(Long id) {
        return buyerRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Buyer", id));
    }

    private Buyer create(BuyerType buyerType, String name, String companyName, String country,
                         String phone, String email, String preferredLanguage) {
        Buyer buyer = new Buyer();
        buyer.setBuyerType(buyerType);
        buyer.setName(name);
        buyer.setCompanyName(companyName);
        buyer.setCountry(country);
        buyer.setPhone(phone);
        buyer.setEmail(email);
        buyer.setPreferredLanguage(preferredLanguage);
        return buyerRepository.save(buyer);
    }
}
