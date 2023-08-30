package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.util.Response;

public interface FiscalYearService {
    Response<FiscalResponseDto> createFiscalYear(FiscalRequestDto fiscalRequestDto);

    Response<FiscalResponseDto> updateFiscalYear(FiscalRequestDto fiscalRequestDto);

    Response<FiscalYear> findAllByActive(boolean isDeleted);
    //Response<FiscalYear> findAllByActive(boolean isDeleted, boolean isActive);

    void isDeleletable();

}
