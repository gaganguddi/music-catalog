package com.gagan.musiccatalog.service.impl;

import com.gagan.musiccatalog.dto.response.DashboardResponse;
import com.gagan.musiccatalog.repository.LibraryRepository;
import com.gagan.musiccatalog.repository.UserRepository;
import com.gagan.musiccatalog.service.DashboardService;
import org.springframework.stereotype.Service;

import com.gagan.musiccatalog.entity.Library;
import com.gagan.musiccatalog.entity.User;
import com.gagan.musiccatalog.dto.response.LibraryResponse;

import java.util.Comparator;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class DashboardServiceImpl implements DashboardService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;

    public DashboardServiceImpl(LibraryRepository libraryRepository,
                                UserRepository userRepository) {
        this.libraryRepository = libraryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public DashboardResponse getDashboard(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<Library> albums = libraryRepository.findByUser(user);

        int totalAlbums = albums.size();

        double averageRating = albums.stream()
                .filter(album -> album.getUserRating() != null)
                .mapToInt(Library::getUserRating)
                .average()
                .orElse(0.0);

        String favoriteGenre = albums.stream()
                .filter(album -> album.getGenre() != null)
                .collect(Collectors.groupingBy(
                        Library::getGenre,
                        Collectors.counting()
                ))
                .entrySet()
                .stream()
                .max(Map.Entry.comparingByValue())
                .map(Map.Entry::getKey)
                .orElse("N/A");

        List<LibraryResponse> recentAlbums = albums.stream()
                .sorted(
                        Comparator.comparing(
                                Library::getCreatedAt,
                                Comparator.nullsLast(Comparator.naturalOrder())
                        ).reversed()
                )
                .limit(5)
                .map(album -> LibraryResponse.builder()
                        .id(album.getId())
                        .appleCatalogId(album.getAppleCatalogId())
                        .title(album.getTitle())
                        .artistName(album.getArtistName())
                        .genre(album.getGenre())
                        .releaseDate(album.getReleaseDate())
                        .trackCount(album.getTrackCount())
                        .artworkUrl(album.getArtworkUrl())
                        .userRating(album.getUserRating())
                        .userNotes(album.getUserNotes())
                        .build())
                .toList();

        return DashboardResponse.builder()
                .totalAlbums(totalAlbums)
                .favoriteGenre(favoriteGenre)
                .averageRating(averageRating)
                .recentAlbums(recentAlbums)
                .build();
    }
}