package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SectorRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface SectorService {

    ResponseEntity<List<SectorResponse>> getActiveSector();

    List<SectorRequest> getBySectorDivisionId(Long sectorDivisionId);

    String generateCode(String sectorNameEn);
}
