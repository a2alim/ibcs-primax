package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TappFinancingAndExpectation;
import com.ibcs.idsdp.dpptapp.web.dto.TappFinancingAndExpectationDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappModeFinancingDTO;

public interface TappFinancingAndExpectationService {
    ResponseWithResults getFinancingExpectation(String pcUuid);
    TappFinancingAndExpectation saveFinancingExpectation(TappFinancingAndExpectationDTO dto);
    TappFinancingAndExpectation updateFinancingExpectation(TappFinancingAndExpectationDTO dto, String pcUuid);
}
