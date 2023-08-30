package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.response.ProcurementMethodResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface ProcurementMethodService {
   ResponseEntity<List<ProcurementMethodResponse>> getActiveProcurementMethods();
   String generateCodeNumber(String versionNameEn);
}
