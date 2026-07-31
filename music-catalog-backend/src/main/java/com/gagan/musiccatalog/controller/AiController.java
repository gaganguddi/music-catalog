package com.gagan.musiccatalog.controller;

import com.gagan.musiccatalog.dto.request.AiRequest;
import com.gagan.musiccatalog.dto.response.AiResponse;
import com.gagan.musiccatalog.service.AiService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/ai")
public class AiController {

    private final AiService aiService;

    public AiController(AiService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/insights")
    public ResponseEntity<AiResponse> generateInsights(
            @Valid @RequestBody AiRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        return ResponseEntity.ok(
                aiService.generateInsights(request.getAlbumId(), email)
        );
    }
}
