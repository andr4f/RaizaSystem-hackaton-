package com.raiza.demo.farm.service;

import com.raiza.demo.farm.dto.CreateFarmRequest;
import com.raiza.demo.farm.dto.FarmResponse;
import com.raiza.demo.farm.entity.Farm;
import com.raiza.demo.farm.mapper.FarmMapper;
import com.raiza.demo.farm.repository.FarmRepository;
import com.raiza.demo.producer.entity.Producer;
import com.raiza.demo.producer.service.ProducerService;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FarmService {

    private final FarmRepository farmRepository;
    private final ProducerService producerService;
    private final FarmMapper farmMapper;

    @Transactional(readOnly = true)
    public List<FarmResponse> findByProducer(Long producerId) {
        return farmRepository.findByProducerId(producerId).stream()
                .map(farmMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public FarmResponse findById(Long id) {
        return farmMapper.toResponse(getFarmOrThrow(id));
    }

    @Transactional
    public FarmResponse create(CreateFarmRequest request) {
        Producer producer = producerService.getProducerOrThrow(request.producerId());

        Farm farm = new Farm();
        farm.setProducer(producer);
        farm.setName(request.name());
        farm.setMunicipality(request.municipality());
        farm.setCorregimiento(request.corregimiento());
        farm.setLatitude(request.latitude());
        farm.setLongitude(request.longitude());
        farm.setAltitudeMeters(request.altitudeMeters());
        farm.setAreaHectares(request.areaHectares());
        farm.setConnectivityLevel(request.connectivityLevel());
        farm.setNotes(request.notes());

        return farmMapper.toResponse(farmRepository.save(farm));
    }

    @Transactional(readOnly = true)
    public Farm getFarmOrThrow(Long id) {
        return farmRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("Farm", id));
    }
}
