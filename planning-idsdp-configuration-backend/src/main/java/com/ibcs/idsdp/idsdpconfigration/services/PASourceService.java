package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.response.PASourceResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface PASourceService {

    ResponseEntity<List<PASourceResponse>> getActivePaSource();

    String generatePaSourceCode(String nameEn);
}
