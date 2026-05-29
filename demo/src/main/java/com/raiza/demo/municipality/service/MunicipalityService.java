package com.raiza.demo.municipality.service;

import com.raiza.demo.municipality.dto.MunicipalityResponse;
import com.raiza.demo.municipality.entity.Municipality;
import com.raiza.demo.municipality.repository.MunicipalityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class MunicipalityService {

    private final MunicipalityRepository municipalityRepository;

    @Transactional(readOnly = true)
    public List<MunicipalityResponse> find(String department, String search) {
        List<Municipality> result;

        boolean hasDepartment = StringUtils.hasText(department);
        boolean hasSearch = StringUtils.hasText(search);

        if (hasDepartment && hasSearch) {
            result = municipalityRepository
                    .findByDepartmentIgnoreCaseAndNameContainingIgnoreCaseOrderByNameAsc(department, search);
        } else if (hasDepartment) {
            result = municipalityRepository.findByDepartmentIgnoreCaseOrderByNameAsc(department);
        } else if (hasSearch) {
            result = municipalityRepository.findByNameContainingIgnoreCaseOrderByNameAsc(search);
        } else {
            result = municipalityRepository.findAll();
        }

        return result.stream().map(this::toResponse).toList();
    }

    private MunicipalityResponse toResponse(Municipality m) {
        return new MunicipalityResponse(m.getId(), m.getName(), m.getDepartment(),
                m.getSubregion(), m.getDaneCode());
    }
}