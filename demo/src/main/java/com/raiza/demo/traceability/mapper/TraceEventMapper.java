package com.raiza.demo.traceability.mapper;

import com.raiza.demo.traceability.dto.TraceEventResponse;
import com.raiza.demo.traceability.entity.TraceEvent;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TraceEventMapper {

    @Mapping(source = "lot.id", target = "lotId")
    TraceEventResponse toResponse(TraceEvent event);
}
