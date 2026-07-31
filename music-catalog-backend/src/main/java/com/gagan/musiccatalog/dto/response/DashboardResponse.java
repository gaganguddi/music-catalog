package com.gagan.musiccatalog.dto.response;

import lombok.Builder;
import lombok.Data;

import java.util.List;

@Data
@Builder
public class DashboardResponse {

    private int totalAlbums;

    private String favoriteGenre;

    private double averageRating;

    private List<LibraryResponse> recentAlbums;
}