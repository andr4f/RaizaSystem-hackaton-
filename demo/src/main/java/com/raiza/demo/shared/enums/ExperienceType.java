package com.raiza.demo.shared.enums;

import com.raiza.demo.shared.dto.ReferenceItem;

import java.util.Arrays;
import java.util.List;

public enum ExperienceType {
    TOUR_FINCA("Tour de finca"),
    CATA("Cata"),
    HOSPEDAJE_RURAL("Hospedaje rural"),
    EXPERIENCIA_CULTURAL("Experiencia cultural"),
    OTRO("Otro");

    private final String label;

    ExperienceType(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static List<ReferenceItem> asItems() {
        return Arrays.stream(values())
                .map(t -> new ReferenceItem(t.name(), t.label))
                .toList();
    }
}
