package com.raiza.demo.certification.mapper;

import com.raiza.demo.certification.dto.CertificationResponse;
import com.raiza.demo.certification.dto.CreateCertificationRequest;
import com.raiza.demo.certification.dto.LotCertificationResponse;
import com.raiza.demo.certification.entity.Certification;
import com.raiza.demo.certification.entity.LotCertification;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface CertificationMapper {

    @Mapping(target = "id", ignore = true)
    @Mapping(target = "createdAt", ignore = true)
    @Mapping(target = "updatedAt", ignore = true)
    Certification toEntity(CreateCertificationRequest request);

    CertificationResponse toResponse(Certification certification);

    @Mapping(source = "lot.id", target = "lotId")
    @Mapping(source = "certification.id", target = "certificationId")
    @Mapping(source = "certification.name", target = "certificationName")
    LotCertificationResponse toResponse(LotCertification lotCertification);
}
