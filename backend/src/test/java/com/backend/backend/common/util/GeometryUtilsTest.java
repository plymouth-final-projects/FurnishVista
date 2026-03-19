package com.backend.backend.common.util;

import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThat;

class GeometryUtilsTest {

    @Test
    void roomDimensionLabelFormatsOneDecimal() {
        String label = GeometryUtils.roomDimensionLabel(3, 4, 2.5);

        assertThat(label).isEqualTo("3.0m × 4.0m × 2.5m");
    }
}
