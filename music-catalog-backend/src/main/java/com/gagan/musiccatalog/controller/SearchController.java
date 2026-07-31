package com.gagan.musiccatalog.controller;

import com.gagan.musiccatalog.dto.itunes.AlbumSearchResponse;
import com.gagan.musiccatalog.service.SearchService;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/search")
public class SearchController {

    private final SearchService searchService;

    public SearchController(SearchService searchService) {
        this.searchService = searchService;
    }

    @GetMapping("/albums")
    public AlbumSearchResponse searchAlbums(@RequestParam String term) {
        return searchService.searchAlbums(term);
    }
}