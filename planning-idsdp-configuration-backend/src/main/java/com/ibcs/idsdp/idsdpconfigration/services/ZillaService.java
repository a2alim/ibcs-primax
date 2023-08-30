package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ZillaRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface ZillaService {

    ResponseEntity<List<ZillaRequest>> getActiveZilla();

    String generateCodeNumber(String versionNameEn);

    List<ZillaRequest> getByDivisionId(Long divisionId);

    List<ZillaRequest> getByDivisionIds(Set<Long> divisionIds);

    List<ZillaRequest> getByDivisionGeoCode(String divisionGeoCode);
}
