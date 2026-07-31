package com.gagan.musiccatalog.dto.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import lombok.Data;

@Data
public class UpdateLibraryRequest {

    @Min(1)
    @Max(5)
    private Integer userRating;

    private String userNotes;
}