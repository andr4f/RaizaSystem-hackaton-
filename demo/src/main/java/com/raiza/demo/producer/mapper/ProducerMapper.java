package com.raiza.demo.producer.mapper;

import com.raiza.demo.producer.dto.CreateProducerRequest;
import com.raiza.demo.producer.dto.ProducerResponse;
import com.raiza.demo.producer.entity.Producer;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ProducerMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    @Mapping(target = "department", source = "department", defaultValue = "Magdalena")
    Producer toEntity(CreateProducerRequest request);

    ProducerResponse toResponse(Producer producer);
}
