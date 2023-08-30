package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.InstallmentType;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.InstallmentTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentTypeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface InstallmentTypeService {

    Response<InstallmentTypeResponseDto> createInstallmentType(InstallmentTypeRequestDto installmentTypeRequestDto);

    Response<InstallmentTypeResponseDto> updateInstallmentType(InstallmentTypeRequestDto installmentTypeRequestDto);

    Response<InstallmentType> findAllByActive(boolean isDeleted, boolean isActive);
}
