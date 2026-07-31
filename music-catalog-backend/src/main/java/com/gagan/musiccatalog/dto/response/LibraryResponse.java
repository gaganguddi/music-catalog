package com.gagan.musiccatalog.dto.response;

import lombok.Builder;
import lombok.Data;
import java.time.LocalDate;

@Data
@Builder
public class LibraryResponse {

    private Long id;

    private Long appleCatalogId;

    private String title;

    private String artistName;

    private String genre;

    private LocalDate releaseDate;

    private Integer trackCount;

    private String artworkUrl;

    private Integer userRating;

    private String userNotes;
}