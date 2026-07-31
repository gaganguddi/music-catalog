package com.gagan.musiccatalog.external;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.gagan.musiccatalog.dto.itunes.AlbumSearchResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.client.RestClient;

@Component
public class ItunesClient {

    private static final String BASE_URL = "https://itunes.apple.com";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public ItunesClient(RestClient restClient, ObjectMapper objectMapper) {
        this.restClient = restClient;
        this.objectMapper = objectMapper;
    }

    public AlbumSearchResponse searchAlbums(String term) {

        try {
            String response = restClient.get()
                    .uri(BASE_URL + "/search?term={term}&entity=album&limit=10", term)
                    .retrieve()
                    .body(String.class);

            return objectMapper.readValue(response, AlbumSearchResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to fetch albums from iTunes", e);
        }
    }
}