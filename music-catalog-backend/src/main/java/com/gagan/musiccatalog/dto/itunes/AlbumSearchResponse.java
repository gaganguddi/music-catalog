package com.gagan.musiccatalog.dto.itunes;

import lombok.Data;

import java.util.List;

@Data
public class AlbumSearchResponse {

    private Integer resultCount;

    private List<AlbumDto> results;
}