package com.gagan.musiccatalog.service;

import com.gagan.musiccatalog.dto.response.DashboardResponse;

public interface DashboardService {

    DashboardResponse getDashboard(String userEmail);

}