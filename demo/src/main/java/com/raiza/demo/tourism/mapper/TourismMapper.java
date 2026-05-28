package com.raiza.demo.tourism.mapper;

import com.raiza.demo.tourism.dto.CreateTourismOperatorRequest;
import com.raiza.demo.tourism.dto.ExperienceLotResponse;
import com.raiza.demo.tourism.dto.ExperienceResponse;
import com.raiza.demo.tourism.dto.TourismOperatorResponse;
import com.raiza.demo.tourism.entity.ExperienceLot;
import com.raiza.demo.tourism.entity.TourismExperience;
import com.raiza.demo.tourism.entity.TourismOperator;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface TourismMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    TourismOperator toEntity(CreateTourismOperatorRequest request);

    TourismOperatorResponse toResponse(TourismOperator operator);

    @Mapping(source = "operator.id", target = "operatorId")
    @Mapping(source = "operator.name", target = "operatorName")
    ExperienceResponse toResponse(TourismExperience experience);

    @Mapping(source = "experience.id", target = "experienceId")
    @Mapping(source = "lot.id", target = "lotId")
    @Mapping(source = "lot.lotCode", target = "lotCode")
    ExperienceLotResponse toResponse(ExperienceLot experienceLot);
}
