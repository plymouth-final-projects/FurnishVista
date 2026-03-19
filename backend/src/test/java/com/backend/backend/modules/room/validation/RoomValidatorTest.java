package com.backend.backend.modules.room.validation;

import com.backend.backend.common.exception.InvalidRoomDimensionException;
import org.junit.jupiter.api.Test;

import static org.assertj.core.api.Assertions.assertThatThrownBy;

class RoomValidatorTest {

    private final RoomValidator validator = new RoomValidator();

    @Test
    void validateAllowsBoundaryValues() {
        validator.validate(1, 1, 2);
        validator.validate(20, 20, 5);
    }

    @Test
    void validateRejectsOutOfRangeDimensions() {
        assertThatThrownBy(() -> validator.validate(0.9, 2, 3))
                .isInstanceOf(InvalidRoomDimensionException.class)
                .hasMessage("Width must be between 1 and 20 meters");

        assertThatThrownBy(() -> validator.validate(2, 21, 3))
                .isInstanceOf(InvalidRoomDimensionException.class)
                .hasMessage("Length must be between 1 and 20 meters");

        assertThatThrownBy(() -> validator.validate(2, 2, 1.5))
                .isInstanceOf(InvalidRoomDimensionException.class)
                .hasMessage("Height must be between 2 and 5 meters");
    }
}
