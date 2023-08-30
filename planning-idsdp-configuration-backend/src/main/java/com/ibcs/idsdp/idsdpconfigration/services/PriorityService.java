package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.response.PriorityResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PriorityService {

    ResponseEntity<List<PriorityResponse>> getActivePriority();
    String generatePriorityCode(String nameEn);
}
