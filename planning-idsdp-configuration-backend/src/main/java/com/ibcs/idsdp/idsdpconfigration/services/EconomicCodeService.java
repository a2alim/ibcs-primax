package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.EconomicCodeRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface EconomicCodeService {

    ResponseEntity<List<EconomicCodeRequest>> getActiveEconomicCode();

    String generateCodeNumber(String versionNameEn);

//    String generateVersionNumber(String versionNameEn);
}
