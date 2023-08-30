package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.UpaZillaRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface UpaZillaService {

    ResponseEntity<List<UpaZillaRequest>> getActiveUpaZilla();

    String generateCodeNumber(String versionNameEn);

    List<UpaZillaRequest> getByZillId(Long zillaId);

    List<UpaZillaRequest> getByZillIds(Set<Long> zillaIds);

    List<UpaZillaRequest> getByZillaGeoCode(String zillaGeoCode);
}
