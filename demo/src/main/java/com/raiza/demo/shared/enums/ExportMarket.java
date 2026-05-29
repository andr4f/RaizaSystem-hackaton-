package com.raiza.demo.shared.enums;

import com.raiza.demo.shared.dto.ReferenceItem;

import java.util.Arrays;
import java.util.List;

public enum ExportMarket {
    EUROPA("Europa"),
    ESTADOS_UNIDOS("Estados Unidos"),
    ASIA("Asia"),
    LATINOAMERICA("Latinoamérica"),
    OTROS("Otros");

    private final String label;

    ExportMarket(String label) {
        this.label = label;
    }

    public String getLabel() {
        return label;
    }

    public static List<ReferenceItem> asItems() {
        return Arrays.stream(values())
                .map(m -> new ReferenceItem(m.name(), m.label))
                .toList();
    }
}
