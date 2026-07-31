package com.gagan.musiccatalog.service;

import com.gagan.musiccatalog.dto.request.LibraryRequest;
import com.gagan.musiccatalog.dto.response.LibraryResponse;
import java.util.List;

import com.gagan.musiccatalog.dto.request.UpdateLibraryRequest;

public interface LibraryService {

    LibraryResponse addAlbum(LibraryRequest request, String userEmail);
    List<LibraryResponse> getMyLibrary(String userEmail);

    LibraryResponse updateAlbum(
            Long id,
            UpdateLibraryRequest request,
            String userEmail
    );

    void deleteAlbum(Long id, String userEmail);

}