package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.UserSerializationConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.UserSerialization;
import com.ibcs.idsdp.rmsConfigration.services.UserSerializationService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.UserSerializationRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.UserSerializationResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(UserSerializationConstant.USER_SERIALIZATION)
public class UserSerializationController extends BaseController<UserSerialization, UserSerializationRequestDto, UserSerializationResponseDto> {

    final private UserSerializationService userSerializationService;

    public UserSerializationController(BaseService<UserSerialization, UserSerializationRequestDto, UserSerializationResponseDto> service, UserSerializationService userSerializationService) {
        super(service);
        this.userSerializationService = userSerializationService;
    }


    @PostMapping(path = UserSerializationConstant.USER_SERIALIZATION_UNIQUE, produces = "application/json")
    public Response<UserSerializationResponseDto> createFiscalBudgetYear(@RequestBody UserSerializationRequestDto userSerializationRequestDto) {
        return userSerializationService.createUserSerialization(userSerializationRequestDto);
    }

    @PutMapping(path = UserSerializationConstant.UPDATE_USER_SERIALIZATION_UNIQUE, produces = "application/json")
    public Response<UserSerializationResponseDto> updateFiscalYearBudget(@RequestBody UserSerializationRequestDto userSerializationRequestDto) {
        return userSerializationService.updateUserSerialization(userSerializationRequestDto);
    }


}
