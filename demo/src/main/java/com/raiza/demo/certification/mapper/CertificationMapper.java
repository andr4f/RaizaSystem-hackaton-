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

    @Mapping(target = "farm", ignore = true)
    @Mapping(target = "registeredBy", ignore = true)
    @Mapping(target = "status", ignore = true)
    @Mapping(target = "registeredAt", ignore = true)
    @Mapping(target = "documentPath", ignore = true)
    Certification toEntity(CreateCertificationRequest request);

    @Mapping(source = "farm.id", target = "farmId")
    CertificationResponse toResponse(Certification certification);

    @Mapping(source = "lot.id", target = "lotId")
    @Mapping(source = "certification.id", target = "certificationId")
    @Mapping(source = "certification.name", target = "certificationName")
    @Mapping(source = "certification.certificateNumber", target = "certificateNumber")
    LotCertificationResponse toResponse(LotCertification lotCertification);
}
