package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DivisionService {

    ResponseEntity<List<DivisionRequest>> getActiveDivision();

    String generateCodeNumber(String versionNameEn);

    List<DivisionRequest> getAllActiveDivisionWithZillaUpazillaAndMunicipalty();

    ResponseEntity<DivisionZillaUpazilaMunicipalityResponse> getAllActiveDivisionZillaUpazillaMunicipality();

}
