package com.raiza.demo.lead.repository;

import com.raiza.demo.buyer.entity.Buyer;
import com.raiza.demo.buyer.repository.BuyerRepository;
import com.raiza.demo.lead.entity.PurchaseLead;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.AbstractRepositoryTest;
import com.raiza.demo.shared.enums.LeadStatus;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;

import java.math.BigDecimal;
import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

class PurchaseLeadRepositoryTest extends AbstractRepositoryTest {

    @Autowired
    private PurchaseLeadRepository purchaseLeadRepository;

    @Autowired
    private ProductLotRepository productLotRepository;

    @Autowired
    private BuyerRepository buyerRepository;

    @Test
    void shouldFindById() {
        var lead = purchaseLeadRepository.findById(1L);

        assertThat(lead).isPresent();
        assertThat(lead.get().getLeadStatus()).isEqualTo(LeadStatus.NEW);
        assertThat(lead.get().getDestinationCountry()).isEqualTo("Denmark");
        assertThat(lead.get().getSourceType()).isEqualTo("QR_SCAN");
    }

    @Test
    void shouldFindByLeadStatus() {
        List<PurchaseLead> leads = purchaseLeadRepository.findByLeadStatus(LeadStatus.NEW);

        assertThat(leads).hasSize(1);
        assertThat(leads.get(0).getRequestedQuantity()).isEqualByComparingTo(new BigDecimal("50.00"));
    }

    @Test
    void shouldFindByLotId() {
        List<PurchaseLead> leads = purchaseLeadRepository.findByLotId(1L);

        assertThat(leads).hasSize(1);
        assertThat(leads.get(0).getBuyer().getName()).isEqualTo("Laura Jensen");
    }

    @Test
    void shouldFindAllByOrderByCreatedAtDesc() {
        List<PurchaseLead> leads = purchaseLeadRepository.findAllByOrderByCreatedAtDesc();

        assertThat(leads).hasSize(1);
    }

    @Test
    void shouldReturnEmptyForUnknownStatus() {
        List<PurchaseLead> leads = purchaseLeadRepository.findByLeadStatus(LeadStatus.CLOSED_WON);

        assertThat(leads).isEmpty();
    }

    @Test
    void shouldSaveNewPurchaseLead() {
        ProductLot lot = productLotRepository.findById(1L).orElseThrow();
        Buyer buyer = buyerRepository.findById(1L).orElseThrow();

        PurchaseLead lead = new PurchaseLead();
        lead.setLot(lot);
        lead.setBuyer(buyer);
        lead.setSourceType("WEB_FORM");
        lead.setRequestedQuantity(new BigDecimal("30.00"));
        lead.setUnitOfMeasure("kg");
        lead.setDestinationCountry("USA");
        lead.setMessage("Interested in sample");
        lead.setLeadStatus(LeadStatus.NEW);

        PurchaseLead saved = purchaseLeadRepository.save(lead);

        assertThat(saved.getId()).isNotNull();
        assertThat(saved.getLeadStatus()).isEqualTo(LeadStatus.NEW);
        assertThat(purchaseLeadRepository.count()).isEqualTo(2);
    }
}
