package com.backend.backend.modules.room.validation;

import com.backend.backend.common.exception.InvalidRoomDimensionException;
import org.springframework.stereotype.Component;

@Component
public class RoomValidator {

    public void validate(double width, double length, double height) {
        if (width < 1 || width > 20) {
            throw new InvalidRoomDimensionException("Width must be between 1 and 20 meters");
        }
        if (length < 1 || length > 20) {
            throw new InvalidRoomDimensionException("Length must be between 1 and 20 meters");
        }
        if (height < 2 || height > 5) {
            throw new InvalidRoomDimensionException("Height must be between 2 and 5 meters");
        }
    }
}
