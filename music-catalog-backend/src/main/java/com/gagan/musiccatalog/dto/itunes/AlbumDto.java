package com.gagan.musiccatalog.dto.itunes;

import lombok.Data;

@Data
public class AlbumDto {

    private Long collectionId;

    private String collectionName;

    private String artistName;

    private Double collectionPrice;

    private String releaseDate;

    private Integer trackCount;

    private String primaryGenreName;

    private String artworkUrl100;
}