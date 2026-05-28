package com.raiza.demo.exporter.mapper;

import com.raiza.demo.exporter.dto.CreateExporterRequest;
import com.raiza.demo.exporter.dto.ExporterResponse;
import com.raiza.demo.exporter.dto.ExporterReviewResponse;
import com.raiza.demo.exporter.entity.ExportReview;
import com.raiza.demo.exporter.entity.Exporter;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface ExporterMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Exporter toEntity(CreateExporterRequest request);

    ExporterResponse toResponse(Exporter exporter);

    @Mapping(source = "lead.id", target = "leadId")
    @Mapping(source = "exporter.id", target = "exporterId")
    @Mapping(source = "exporter.name", target = "exporterName")
    ExporterReviewResponse toResponse(ExportReview review);
}
