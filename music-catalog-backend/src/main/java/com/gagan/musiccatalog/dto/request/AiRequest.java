package com.gagan.musiccatalog.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Data;

@Data
public class AiRequest {

    @NotNull
    private Long albumId;

}