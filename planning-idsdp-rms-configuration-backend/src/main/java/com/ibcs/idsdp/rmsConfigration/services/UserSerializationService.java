package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.model.domain.UserSerialization;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.UserSerializationRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.UserSerializationResponseDto;
import com.ibcs.idsdp.util.Response;

public interface UserSerializationService {
    Response<UserSerializationResponseDto> createUserSerialization(UserSerializationRequestDto userSerializationRequestDto);

    Response<UserSerializationResponseDto> updateUserSerialization(UserSerializationRequestDto userSerializationRequestDto);

    Response<UserSerialization> findAllByIsActive(boolean isDeleted, boolean isActive);

}
