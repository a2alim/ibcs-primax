package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ProcurementTypeResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProcurementTypeService {
    ResponseEntity<List<ProcurementTypeResponse>> getActiveProcurementTypes();
    String generateCodeNumber(String code);
}
