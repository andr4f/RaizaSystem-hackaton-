package com.raiza.demo.certification.dto;

public record ProducerAnswerItem(
        String questionKey,
        String question,
        String answer,
        boolean compliant
) {}
