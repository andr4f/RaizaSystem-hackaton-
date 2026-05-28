package com.raiza.demo.tourism.service;

import com.raiza.demo.lot.entity.ProductLot;
import com.raiza.demo.lot.service.ProductLotService;
import com.raiza.demo.shared.enums.ActorType;
import com.raiza.demo.shared.enums.TraceEventType;
import com.raiza.demo.shared.exception.ResourceNotFoundException;
import com.raiza.demo.tourism.dto.CreateExperienceRequest;
import com.raiza.demo.tourism.dto.CreateTourismOperatorRequest;
import com.raiza.demo.tourism.dto.ExperienceLotResponse;
import com.raiza.demo.tourism.dto.ExperienceResponse;
import com.raiza.demo.tourism.dto.LinkExperienceLotRequest;
import com.raiza.demo.tourism.dto.TourismOperatorResponse;
import com.raiza.demo.tourism.entity.ExperienceLot;
import com.raiza.demo.tourism.entity.TourismExperience;
import com.raiza.demo.tourism.entity.TourismOperator;
import com.raiza.demo.tourism.mapper.TourismMapper;
import com.raiza.demo.tourism.repository.ExperienceLotRepository;
import com.raiza.demo.tourism.repository.TourismExperienceRepository;
import com.raiza.demo.tourism.repository.TourismOperatorRepository;
import com.raiza.demo.traceability.service.TraceEventService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.util.StringUtils;

import java.util.List;
import java.util.Locale;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class TourismService {

    private final TourismOperatorRepository tourismOperatorRepository;
    private final TourismExperienceRepository tourismExperienceRepository;
    private final ExperienceLotRepository experienceLotRepository;
    private final ProductLotService productLotService;
    private final TraceEventService traceEventService;
    private final TourismMapper tourismMapper;

    @Transactional(readOnly = true)
    public List<TourismOperatorResponse> findAllOperators() {
        return tourismOperatorRepository.findAll().stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional
    public TourismOperatorResponse createOperator(CreateTourismOperatorRequest request) {
        TourismOperator saved = tourismOperatorRepository.save(tourismMapper.toEntity(request));
        return tourismMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public List<ExperienceResponse> findAllExperiences() {
        return tourismExperienceRepository.findAll().stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional(readOnly = true)
    public ExperienceResponse findExperienceById(Long id) {
        return tourismMapper.toResponse(getExperienceOrThrow(id));
    }

    @Transactional
    public ExperienceResponse createExperience(CreateExperienceRequest request) {
        TourismOperator operator = getOperatorOrThrow(request.operatorId());

        TourismExperience experience = new TourismExperience();
        experience.setOperator(operator);
        experience.setTitle(request.title());
        experience.setLocationName(request.locationName());
        experience.setDescription(request.description());
        experience.setQrSlug(resolveSlug(request.qrSlug(), request.title()));

        return tourismMapper.toResponse(tourismExperienceRepository.save(experience));
    }

    @Transactional(readOnly = true)
    public List<ExperienceLotResponse> findLotsForExperience(Long experienceId) {
        return experienceLotRepository.findByExperienceIdOrderByDisplayPriorityAsc(experienceId).stream()
                .map(tourismMapper::toResponse)
                .toList();
    }

    @Transactional
    public ExperienceLotResponse linkLot(LinkExperienceLotRequest request) {
        TourismExperience experience = getExperienceOrThrow(request.experienceId());
        ProductLot lot = productLotService.getLotOrThrow(request.lotId());

        ExperienceLot link = new ExperienceLot();
        link.setExperience(experience);
        link.setLot(lot);
        link.setDisplayPriority(request.displayPriority() != null ? request.displayPriority() : 1);
        link.setNotes(request.notes());
        ExperienceLot saved = experienceLotRepository.save(link);

        traceEventService.record(lot, TraceEventType.TOURISM_LINKED, ActorType.TOURISM_OPERATOR,
                experience.getOperator().getId(),
                "Tourism experience linked: " + experience.getTitle(),
                "Lot " + lot.getLotCode() + " linked to tourism experience " + experience.getTitle());

        return tourismMapper.toResponse(saved);
    }

    @Transactional(readOnly = true)
    public TourismOperator getOperatorOrThrow(Long id) {
        return tourismOperatorRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("TourismOperator", id));
    }

    @Transactional(readOnly = true)
    public TourismExperience getExperienceOrThrow(Long id) {
        return tourismExperienceRepository.findById(id)
                .orElseThrow(() -> ResourceNotFoundException.of("TourismExperience", id));
    }

    private String resolveSlug(String requested, String title) {
        String base = StringUtils.hasText(requested) ? requested : slugify(title);
        String slug = base;
        while (tourismExperienceRepository.findByQrSlug(slug).isPresent()) {
            slug = base + "-" + UUID.randomUUID().toString().substring(0, 6);
        }
        return slug;
    }

    private String slugify(String value) {
        String slug = value.toLowerCase(Locale.ROOT)
                .replaceAll("[^a-z0-9]+", "-")
                .replaceAll("(^-|-$)", "");
        return StringUtils.hasText(slug) ? slug : "experience";
    }
}
