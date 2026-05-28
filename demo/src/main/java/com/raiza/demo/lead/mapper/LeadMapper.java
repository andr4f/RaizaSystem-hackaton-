package com.raiza.demo.lead.mapper;

import com.raiza.demo.lead.dto.LeadResponse;
import com.raiza.demo.lead.entity.PurchaseLead;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface LeadMapper {

    @Mapping(source = "lot.id", target = "lotId")
    @Mapping(source = "lot.lotCode", target = "lotCode")
    @Mapping(source = "buyer.id", target = "buyerId")
    @Mapping(source = "buyer.name", target = "buyerName")
    @Mapping(source = "buyer.buyerType", target = "buyerType")
    LeadResponse toResponse(PurchaseLead lead);
}
