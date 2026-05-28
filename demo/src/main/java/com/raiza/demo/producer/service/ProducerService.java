package com.raiza.demo.producer.service;

import com.raiza.demo.producer.dto.CreateProducerRequest;
import com.raiza.demo.producer.dto.ProducerResponse;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.mapper.ProducerMapper;
import com.raiza.demo.producer.repository.ProducerRepository;
import com.raiza.demo.shared.exception.DuplicateResourceException;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProducerService {

    private final ProducerRepository producerRepository;
    private final ProducerMapper producerMapper;

    @Transactional(readOnly = true)
    public List<ProducerResponse> findAll() {
        return producerRepository.findAll().stream()
                .map(producerMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ProducerResponse findById(Long id) {
        return producerMapper.toResponse(getProducerOrThrow(id));
    }

    @Transactional
    public ProducerResponse create(CreateProducerRequest request) {
        if (StringUtils.hasText(request.documentNumber())) {
            producerRepository.findByDocumentNumber(request.documentNumber()).ifPresent(existing -> {
                throw new DuplicateResourceException("Producer already exists with document: " + request.documentNumber());
            });
        }
        Producer saved = producerRepository.save(producerMapper.toEntity(request));
        return producerMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public Producer getProducerOrThrow(Long id) {
        return producerRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Producer", id));
    }
}
