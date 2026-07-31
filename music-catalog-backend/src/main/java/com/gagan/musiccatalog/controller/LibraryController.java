package com.gagan.musiccatalog.controller;

import com.gagan.musiccatalog.dto.request.LibraryRequest;
import com.gagan.musiccatalog.dto.response.LibraryResponse;
import com.gagan.musiccatalog.service.LibraryService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import com.gagan.musiccatalog.dto.request.UpdateLibraryRequest;

import java.util.List;

@RestController
@RequestMapping("/api/library")
public class LibraryController {

    private final LibraryService libraryService;

    public LibraryController(LibraryService libraryService) {
        this.libraryService = libraryService;
    }

    @PostMapping
    public ResponseEntity<LibraryResponse> addAlbum(
            @Valid @RequestBody LibraryRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        LibraryResponse response =
                libraryService.addAlbum(request, email);

        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping
    public ResponseEntity<List<LibraryResponse>> getMyLibrary(
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                libraryService.getMyLibrary(email)
        );
    }

    @PutMapping("/{id}")
    public ResponseEntity<LibraryResponse> updateAlbum(
            @PathVariable Long id,
            @Valid @RequestBody UpdateLibraryRequest request,
            Authentication authentication) {

        return ResponseEntity.ok(
                libraryService.updateAlbum(
                        id,
                        request,
                        authentication.getName()
                )
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAlbum(
            @PathVariable Long id,
            Authentication authentication) {

        libraryService.deleteAlbum(id, authentication.getName());

        return ResponseEntity.noContent().build();
    }


}