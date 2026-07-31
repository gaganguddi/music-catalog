package com.gagan.musiccatalog.service;

import com.gagan.musiccatalog.dto.request.LoginRequest;
import com.gagan.musiccatalog.dto.request.RegisterRequest;
import com.gagan.musiccatalog.dto.response.AuthResponse;

public interface AuthService {

    AuthResponse register(RegisterRequest request);

    AuthResponse login(LoginRequest request);
}