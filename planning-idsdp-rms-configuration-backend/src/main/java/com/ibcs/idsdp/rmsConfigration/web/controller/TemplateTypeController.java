package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.TemplateTypeConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.TemplateType;
import com.ibcs.idsdp.rmsConfigration.services.TemplateTypeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.TemplateTypeRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.InstallmentTypeResponseDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(TemplateTypeConstant.TEMPLATE_TYPE)
public class TemplateTypeController extends BaseController<TemplateType, TemplateTypeRequestDto, TemplateTypeResponseDto> {

    final private TemplateTypeService templateTypeService;

    public TemplateTypeController(BaseService<TemplateType, TemplateTypeRequestDto, TemplateTypeResponseDto> service, TemplateTypeService templateTypeService) {
        super(service);
        this.templateTypeService = templateTypeService;
    }

    @PostMapping(path = TemplateTypeConstant.TEMPLATE_TYPE_UNIQUE, produces = "application/json")
    public Response<TemplateTypeResponseDto> createFiscalYear(@RequestBody TemplateTypeRequestDto typeRequestDto) {
        return templateTypeService.createTemplateType(typeRequestDto);
    }

    @PutMapping(path = TemplateTypeConstant.UPDATE_TEMPLATE_TYPE_UNIQUE, produces = "application/json")
    public Response<TemplateTypeResponseDto> updateFiscalYear(@RequestBody TemplateTypeRequestDto typeRequestDto) {
        return templateTypeService.updateTemplateType(typeRequestDto);
    }


    @GetMapping(path = TemplateTypeConstant.ACTIVE_TEMPLATE_TYPE, produces = "application/json")
    public Response<TemplateType> findAllByActive() {
        return templateTypeService.findAllByActive(false,true);
    }

    @GetMapping(path = TemplateTypeConstant.TEMPLATE_TYPE_BY_ID, produces = "application/json")
    public Response<TemplateTypeResponseDto> getbyId(@PathVariable Long id) {
        return templateTypeService.findById(id);
    }


}
