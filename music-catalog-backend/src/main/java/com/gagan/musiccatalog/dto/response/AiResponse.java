package com.gagan.musiccatalog.dto.response;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class AiResponse {

    private String albumReview;

    private String artistSummary;

    private String genreInsight;

    private String recommendation;

}