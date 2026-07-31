package com.gagan.musiccatalog.service;

import com.gagan.musiccatalog.dto.itunes.AlbumSearchResponse;


public interface SearchService {

     AlbumSearchResponse searchAlbums(String term);

   // String searchAlbums(String term);

}