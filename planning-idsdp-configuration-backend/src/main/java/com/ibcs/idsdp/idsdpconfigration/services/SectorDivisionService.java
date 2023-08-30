package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SectorDivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorDivisionResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SectorDivisionService {

    ResponseEntity<List<SectorDivisionResponse>> getActiveSectorDivision();

    String generateCode(String sectorDivisionNameEn);
}
