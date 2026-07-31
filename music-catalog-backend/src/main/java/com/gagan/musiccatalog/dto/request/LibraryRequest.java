package com.gagan.musiccatalog.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;
import java.time.LocalDate;
import jakarta.validation.constraints.NotNull;

@Data
public class LibraryRequest {

    @NotNull
    private Long appleCatalogId;

    @NotBlank
    private String title;

    @NotBlank
    private String artistName;

    private String genre;

    private LocalDate releaseDate;

    private Integer trackCount;

    private String artworkUrl;

    private Integer userRating;

    private String userNotes;
}