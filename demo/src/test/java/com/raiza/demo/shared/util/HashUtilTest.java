package com.raiza.demo.shared.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class HashUtilTest {

    @Test
    void sha256_produces64CharLowercaseHex() {
        String hash = HashUtil.sha256Hex("test payload");
        assertThat(hash).hasSize(64).matches("[0-9a-f]{64}");
    }

    @Test
    void sha256_isDeterministic() {
        String payload = "1|LOT_CREATED|2026-05-15T08:00|PRODUCER|1|Lote registrado|GENESIS";
        assertThat(HashUtil.sha256Hex(payload)).isEqualTo(HashUtil.sha256Hex(payload));
    }

    @Test
    void sha256_differentiatesDistinctPayloads() {
        assertThat(HashUtil.sha256Hex("evento_A")).isNotEqualTo(HashUtil.sha256Hex("evento_B"));
    }

    @Test
    void genesis_constantIsDefined() {
        assertThat(HashUtil.GENESIS).isNotBlank();
    }

    @Test
    void hashChainSimulation_threeEventsProduceUniqueLinkedHashes() {
        // Reproduces the exact chain logic used by TraceEventService.persistWithHashChain()
        String h1 = HashUtil.sha256Hex("1|LOT_CREATED|2026-05-15T08:00|PRODUCER|1|Lote registrado|" + HashUtil.GENESIS);
        String h2 = HashUtil.sha256Hex("1|HARVEST_COMPLETED|2026-05-20T10:30|PRODUCER|1|Cosecha finalizada|" + h1);
        String h3 = HashUtil.sha256Hex("1|QUALITY_CHECKED|2026-05-22T14:00|SYSTEM|null|Control de calidad|" + h2);

        assertThat(h1).hasSize(64);
        assertThat(h2).hasSize(64);
        assertThat(h3).hasSize(64);

        // Each step produces a different hash (tampering with any field breaks the chain)
        assertThat(h1).isNotEqualTo(h2);
        assertThat(h2).isNotEqualTo(h3);
        assertThat(h1).isNotEqualTo(h3);
    }

    @Test
    void tamperingPayload_producesCompletelyDifferentHash() {
        String original = HashUtil.sha256Hex("1|LOT_CREATED|2026-05-15|PRODUCER|1|Lote registrado|GENESIS");
        String tampered = HashUtil.sha256Hex("1|LOT_CREATED|2026-05-15|PRODUCER|1|Lote MODIFICADO|GENESIS");

        assertThat(original).isNotEqualTo(tampered);
    }
}
