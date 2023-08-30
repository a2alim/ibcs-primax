package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommonTypes;
import com.ibcs.idsdp.rmsConfigration.services.CommonTypesService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.CommonTypesRequestDTO;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.CommonTypesResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping("api/common-type/")
public class CommonTypesController extends BaseController<CommonTypes, CommonTypesRequestDTO, CommonTypesResponseDto> {

    public final CommonTypesService commonTypesService;

    public CommonTypesController(BaseService<CommonTypes, CommonTypesRequestDTO, CommonTypesResponseDto> service, CommonTypesService commonTypesService) {
        super(service);
        this.commonTypesService = commonTypesService;
    }

    @PostMapping(path = "add", produces = "application/json")
    public Response<CommonTypesResponseDto> createCommonType(@RequestBody CommonTypesRequestDTO commonTypesRequestDTO) {

        return commonTypesService.createCommonType(commonTypesRequestDTO);
    }

    @PutMapping(path = "edit", produces = "application/json")
    public Response<CommonTypesResponseDto> updateCommonType(@RequestBody CommonTypesRequestDTO commonTypesRequestDTO) {
        return commonTypesService.updateCommonType(commonTypesRequestDTO);
    }

    /*
    "1=Seciality","2=Professions", "3=Education Level", "Document Type","Education Level", "Presentation Type",
    "Program Nature Type", "Presentation Status", "Request Type"
    http://localhost:8081/rms-configuration/api/common-type/get-seciality/1
     */
    @GetMapping(path = "get-seciality/{typeNo}", produces = "application/json")
    public ResponseEntity<List<CommonTypes>> findAllByActiveData(@PathVariable("typeNo") Integer typeNo) {
        return commonTypesService.findAllByActiveData(typeNo);
    }
}
