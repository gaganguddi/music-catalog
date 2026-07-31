package com.gagan.musiccatalog.service;

import com.gagan.musiccatalog.dto.response.AiResponse;

public interface AiService {

    AiResponse generateInsights(Long albumId, String userEmail);

}