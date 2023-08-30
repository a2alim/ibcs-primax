package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.MunicipalityRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface MunicipalityService {
    ResponseEntity<List<MunicipalityRequest>> getActiveMunicipality();

    List<MunicipalityRequest> getMunicipalityByUpazilaId(Long upazilaId);

    List<MunicipalityRequest> getMunicipalityByUpazilaIds(Set<Long> upazilaIds);

    String generateCodeNumber(String code);
}
