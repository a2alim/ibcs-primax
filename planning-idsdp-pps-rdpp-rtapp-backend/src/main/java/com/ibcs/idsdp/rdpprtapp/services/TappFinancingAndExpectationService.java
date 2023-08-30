package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappFinancingAndExpectation;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappFinancingAndExpectationDTO;

public interface TappFinancingAndExpectationService {
    ResponseWithResults getFinancingExpectation(String pcUuid);
    TappFinancingAndExpectation saveFinancingExpectation(TappFinancingAndExpectationDTO dto);
    TappFinancingAndExpectation updateFinancingExpectation(TappFinancingAndExpectationDTO dto, String pcUuid);
}
