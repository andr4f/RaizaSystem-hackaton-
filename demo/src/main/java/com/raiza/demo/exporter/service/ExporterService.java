package com.raiza.demo.exporter.service;

import com.raiza.demo.exporter.dto.CreateExporterRequest;
import com.raiza.demo.exporter.dto.ExporterResponse;
import com.raiza.demo.exporter.entity.Exporter;
import com.raiza.demo.exporter.mapper.ExporterMapper;
import com.raiza.demo.exporter.repository.ExporterRepository;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ExporterService {

    private final ExporterRepository exporterRepository;
    private final ExporterMapper exporterMapper;

    @Transactional(readOnly = true)
    public List<ExporterResponse> findAll() {
        return exporterRepository.findAll().stream()
                .map(exporterMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExporterResponse findById(Long id) {
        return exporterMapper.toResponse(getExporterOrThrow(id));
    }

    @Transactional
    public ExporterResponse create(CreateExporterRequest request) {
        if (StringUtils.hasText(request.registrationCode())) {
            exporterRepository.findByRegistrationCode(request.registrationCode()).ifPresent(existing -> {
                throw new DuplicateResourceException("Exporter already exists with registration code: " + request.registrationCode());
            });
        }
        Exporter saved = exporterRepository.save(exporterMapper.toEntity(request));
        return exporterMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Exporter getExporterOrThrow(Long id) {
        return exporterRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Exporter", id));
    }
}
