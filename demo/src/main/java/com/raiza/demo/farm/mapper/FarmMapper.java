package com.raiza.demo.farm.mapper;

import com.raiza.demo.farm.dto.FarmResponse;
import com.raiza.demo.farm.entity.Farm;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface FarmMapper {

    @Mapping(source = "producer.id", target = "producerId")
    @Mapping(source = "producer.name", target = "producerName")
    FarmResponse toResponse(Farm farm);
}
