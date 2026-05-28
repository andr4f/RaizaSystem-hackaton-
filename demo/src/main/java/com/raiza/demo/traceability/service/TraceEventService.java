package com.raiza.demo.traceability.service;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.repository.ProductLotRepository;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.shared.util.HashUtil;
import com.raiza.demo.traceability.dto.CreateTraceEventRequest;
import com.raiza.demo.traceability.dto.TraceEventResponse;
import com.raiza.demo.traceability.entity.TraceEvent;
import com.raiza.demo.traceability.mapper.TraceEventMapper;
import com.raiza.demo.traceability.repository.TraceEventRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class TraceEventService {

    private final TraceEventRepository traceEventRepository;
    private final ProductLotRepository productLotRepository;
    private final TraceEventMapper traceEventMapper;

    @Transactional
    public TraceEventResponse createTraceEvent(CreateTraceEventRequest request) {
        ProductLot lot = productLotRepository.findById(request.lotId())
                .orElseThrow(() -> ResourceNotFoundException.of("ProductLot", request.lotId()));

        TraceEvent event = new TraceEvent();
        event.setLot(lot);
        event.setEventType(request.eventType());
        event.setEventTimestamp(request.eventTimestamp() != null ? request.eventTimestamp() : LocalDateTime.now());
        event.setActorType(request.actorType());
        event.setActorId(request.actorId());
        event.setTitle(request.title());
        event.setDescription(request.description());
        event.setLatitude(request.latitude());
        event.setLongitude(request.longitude());
        event.setMetricName(request.metricName());
        event.setMetricValue(request.metricValue());
        event.setMetricUnit(request.metricUnit());

        return traceEventMapper.toResponse(persistWithHashChain(event));
    }

    @Transactional
    public TraceEvent record(ProductLot lot, TraceEventType eventType, ActorType actorType,
                             Long actorId, String title, String description) {
        TraceEvent event = new TraceEvent();
        event.setLot(lot);
        event.setEventType(eventType);
        event.setEventTimestamp(LocalDateTime.now());
        event.setActorType(actorType);
        event.setActorId(actorId);
        event.setTitle(title);
        event.setDescription(description);
        return persistWithHashChain(event);
    }

    @Transactional(readOnly = true)
    public List<TraceEventResponse> getTimeline(Long lotId) {
        if (!productLotRepository.existsById(lotId)) {
            throw ResourceNotFoundException.of("ProductLot", lotId);
        }
        return traceEventRepository.findByLotIdOrderByEventTimestampAsc(lotId).stream()
                .map(traceEventMapper::toResponse)
                .toList();
    }

    private TraceEvent persistWithHashChain(TraceEvent event) {
        String previousHash = traceEventRepository
                .findFirstByLotIdOrderByIdDesc(event.getLot().getId())
                .map(TraceEvent::getHashValue)
                .orElse(HashUtil.GENESIS);

        event.setPreviousHash(previousHash);
        event.setHashValue(HashUtil.sha256Hex(buildCanonicalPayload(event, previousHash)));
        return traceEventRepository.save(event);
    }

    private String buildCanonicalPayload(TraceEvent event, String previousHash) {
        return String.join("|",
                String.valueOf(event.getLot().getId()),
                String.valueOf(event.getEventType()),
                String.valueOf(event.getEventTimestamp()),
                String.valueOf(event.getActorType()),
                String.valueOf(event.getActorId()),
                String.valueOf(event.getTitle()),
                previousHash);
    }
}
