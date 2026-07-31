package com.gagan.musiccatalog.service.impl;

import com.gagan.musiccatalog.dto.response.AiResponse;
import com.gagan.musiccatalog.entity.Library;
import com.gagan.musiccatalog.entity.User;
import com.gagan.musiccatalog.external.GeminiClient;
import com.gagan.musiccatalog.repository.LibraryRepository;
import com.gagan.musiccatalog.repository.UserRepository;
import com.gagan.musiccatalog.service.AiService;
import org.springframework.stereotype.Service;

import com.fasterxml.jackson.databind.ObjectMapper;

@Service
public class AiServiceImpl implements AiService {

    private final GeminiClient geminiClient;
    private final LibraryRepository libraryRepository;
    private final UserRepository userRepository;

    private final ObjectMapper objectMapper;

    public AiServiceImpl(
            GeminiClient geminiClient,
            LibraryRepository libraryRepository,
            UserRepository userRepository,
            ObjectMapper objectMapper
    ) {
        this.geminiClient = geminiClient;
        this.libraryRepository = libraryRepository;
        this.userRepository = userRepository;
        this.objectMapper = objectMapper;
    }

    @Override
    public AiResponse generateInsights(Long albumId, String userEmail) {

        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new RuntimeException("User not found"));

        Library album = libraryRepository
                .findByIdAndUser(albumId, user)
                .orElseThrow(() -> new RuntimeException("Album not found"));

        String prompt = """
You are a music expert.

Analyze the following album.

Album: %s
Artist: %s
Genre: %s
Release Date: %s
User Rating: %s

Return ONLY valid JSON.

{
  "albumReview": "A detailed review of the album.",
  "artistSummary": "A summary about the artist.",
  "genreInsight": "Interesting facts about the genre.",
  "recommendation": "Recommend similar albums."
}

Do not include markdown.
Do not include ```json.
Do not include explanations.
Return only JSON.
"""
                .formatted(
                        album.getTitle(),
                        album.getArtistName(),
                        album.getGenre(),
                        album.getReleaseDate(),
                        album.getUserRating()
                );

        try {

            String aiText = geminiClient.generateContent(prompt);

            return objectMapper.readValue(aiText, AiResponse.class);

        } catch (Exception e) {
            throw new RuntimeException("Failed to parse AI response", e);
        }
    }
}