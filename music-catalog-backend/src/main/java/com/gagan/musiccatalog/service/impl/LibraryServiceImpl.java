package com.gagan.musiccatalog.service.impl;

import com.gagan.musiccatalog.dto.request.LibraryRequest;
import com.gagan.musiccatalog.dto.response.LibraryResponse;
import com.gagan.musiccatalog.entity.Library;
import com.gagan.musiccatalog.entity.User;
import com.gagan.musiccatalog.repository.LibraryRepository;
import com.gagan.musiccatalog.repository.UserRepository;
import com.gagan.musiccatalog.service.LibraryService;
import org.springframework.stereotype.Service;

import com.gagan.musiccatalog.dto.request.UpdateLibraryRequest;

import com.gagan.musiccatalog.exception.ResourceAlreadyExistsException;

import java.util.List;

@Service
public class LibraryServiceImpl implements LibraryService {

    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;

    public LibraryServiceImpl(LibraryRepository libraryRepository,
                              UserRepository userRepository) {
        this.libraryRepository = libraryRepository;
        this.userRepository = userRepository;
    }

    @Override
    public LibraryResponse addAlbum(LibraryRequest request, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (libraryRepository.existsByUserAndAppleCatalogId(user, request.getAppleCatalogId())) {
            throw new ResourceAlreadyExistsException(
                    "Album already exists in your library"
            );
        }

        Library library = new Library();

        library.setAppleCatalogId(request.getAppleCatalogId());
        library.setTitle(request.getTitle());
        library.setArtistName(request.getArtistName());
        library.setGenre(request.getGenre());
        library.setReleaseDate(request.getReleaseDate());
        library.setTrackCount(request.getTrackCount());
        library.setArtworkUrl(request.getArtworkUrl());
        library.setUserRating(request.getUserRating());
        library.setUserNotes(request.getUserNotes());

        library.setUser(user);

        Library saved = libraryRepository.save(library);

        return LibraryResponse.builder()
                .id(saved.getId())
                .appleCatalogId(saved.getAppleCatalogId())
                .title(saved.getTitle())
                .artistName(saved.getArtistName())
                .genre(saved.getGenre())
                .releaseDate(saved.getReleaseDate())
                .trackCount(saved.getTrackCount())
                .artworkUrl(saved.getArtworkUrl())
                .userRating(saved.getUserRating())
                .userNotes(saved.getUserNotes())
                .build();
    }
    @Override
    public List<LibraryResponse> getMyLibrary(String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return libraryRepository.findByUser(user)
                .stream()
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
    }

    @Override
    public LibraryResponse updateAlbum(
            Long id,
            UpdateLibraryRequest request,
            String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Library library = libraryRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        library.setUserRating(request.getUserRating());
        library.setUserNotes(request.getUserNotes());

        Library updated = libraryRepository.save(library);

        return LibraryResponse.builder()
                .id(updated.getId())
                .appleCatalogId(updated.getAppleCatalogId())
                .title(updated.getTitle())
                .artistName(updated.getArtistName())
                .genre(updated.getGenre())
                .releaseDate(updated.getReleaseDate())
                .trackCount(updated.getTrackCount())
                .artworkUrl(updated.getArtworkUrl())
                .userRating(updated.getUserRating())
                .userNotes(updated.getUserNotes())
                .build();
    }

    @Override
    public void deleteAlbum(Long id, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Library library = libraryRepository
                .findByIdAndUser(id, user)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        libraryRepository.delete(library);
    }
}