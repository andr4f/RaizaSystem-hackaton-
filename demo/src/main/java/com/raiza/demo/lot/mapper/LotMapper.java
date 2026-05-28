package com.raiza.demo.lot.mapper;

import com.raiza.demo.certification.dto.LotCertificationResponse;
import com.raiza.demo.lot.dto.LotDetailResponse;
import com.raiza.demo.lot.dto.LotResponse;
import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.traceability.dto.TraceEventResponse;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

import java.util.List;

@Mapper(componentModel = "spring")
public interface LotMapper {

    @Mapping(source = "producer.id", target = "producerId")
    @Mapping(source = "producer.name", target = "producerName")
    @Mapping(source = "farm.id", target = "farmId")
    @Mapping(source = "farm.name", target = "farmName")
    @Mapping(source = "product.id", target = "productId")
    @Mapping(source = "product.name", target = "productName")
    LotResponse toResponse(ProductLot lot);

    @Mapping(source = "lot.producer.id", target = "producerId")
    @Mapping(source = "lot.producer.name", target = "producerName")
    @Mapping(source = "lot.farm.id", target = "farmId")
    @Mapping(source = "lot.farm.name", target = "farmName")
    @Mapping(source = "lot.product.id", target = "productId")
    @Mapping(source = "lot.product.name", target = "productName")
    @Mapping(source = "lot.product.category", target = "productCategory")
    @Mapping(source = "certifications", target = "certifications")
    @Mapping(source = "events", target = "events")
    LotDetailResponse toDetailResponse(ProductLot lot,
                                       List<LotCertificationResponse> certifications,
                                       List<TraceEventResponse> events);
}
