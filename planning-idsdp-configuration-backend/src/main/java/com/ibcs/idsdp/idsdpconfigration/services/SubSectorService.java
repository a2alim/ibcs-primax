package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubSectorRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SubSectorResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Optional;

public interface SubSectorService {

    ResponseEntity<List<SubSectorResponse>> getActiveSubSector();

    String generateCode(String subSectorNameEn);

    List<SubSectorRequest>  getBySectorId(long sectorId);

    Optional<SubSectorRequest> getBySubSectorNameEn(String subSectorNameEn);

    Optional<SubSectorRequest> getBySubSectorCode(String subSectorCode);
}
