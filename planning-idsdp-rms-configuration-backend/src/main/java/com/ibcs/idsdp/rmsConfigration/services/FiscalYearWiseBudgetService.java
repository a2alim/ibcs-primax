package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudget;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalYearWiseBudgetRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalYearWiseBudgetResponseDto;
import com.ibcs.idsdp.util.Response;

public interface FiscalYearWiseBudgetService {
    Response<FiscalYearWiseBudgetResponseDto> createFiscalYearWiseBudget(FiscalYearWiseBudgetRequestDto fiscalYearWiseBudgetRequestDto);

    Response<FiscalYearWiseBudgetResponseDto> updateFiscalYearWiseBudget(FiscalYearWiseBudgetRequestDto fiscalYearWiseBudgetRequestDto);

    Response<FiscalYearWiseBudget> findAllByActive(boolean isDeleted, boolean isActive);

}
