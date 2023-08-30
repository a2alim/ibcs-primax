package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubEconomicCodeRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.EcCodeWithSubEcCode;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface SubEconomicCodeService {

    ResponseEntity<List<SubEconomicCodeRequest>> getActiveSubEconomicCode();

    String generateCodeNumber(String versionNameEn);

//    String generateVersionNumber(String versionNameEn);

    List<SubEconomicCodeRequest> getByEconomicCodeId(long economicCodeId);

    ResponseEntity<List<EcCodeWithSubEcCode>> getSubEconomicCodeByEconomicCodeSet(Set<Long> economicCodes);
}
