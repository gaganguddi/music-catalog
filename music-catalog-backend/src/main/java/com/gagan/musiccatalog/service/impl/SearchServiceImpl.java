package com.gagan.musiccatalog.service.impl;

import com.gagan.musiccatalog.dto.itunes.AlbumSearchResponse;
import com.gagan.musiccatalog.external.ItunesClient;
import com.gagan.musiccatalog.service.SearchService;
import org.springframework.stereotype.Service;

@Service
public class SearchServiceImpl implements SearchService {

    private final ItunesClient itunesClient;

    public SearchServiceImpl(ItunesClient itunesClient) {
        this.itunesClient = itunesClient;
    }

    @Override
    public AlbumSearchResponse searchAlbums(String term) {
        return itunesClient.searchAlbums(term);
    }

//@Override
//public String searchAlbums(String term) {
   // return itunesClient.searchAlbums(term);
//}
}