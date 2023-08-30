package com.ibcs.idsdp.rmsConfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rmsConfigration.constants.CommitteeTypeConstant;
import com.ibcs.idsdp.rmsConfigration.constants.PredefineTemplateConstant;
import com.ibcs.idsdp.rmsConfigration.model.domain.CommitteeType;
import com.ibcs.idsdp.rmsConfigration.model.domain.PredefineTemplate;
import com.ibcs.idsdp.rmsConfigration.services.PredefineTemplateService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.PredefineTemplateRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(PredefineTemplateConstant.PREDEFINE_TEMPLATE)
public class PredefineTemplateController extends BaseController<PredefineTemplate, PredefineTemplateRequestDto, PredefineTemplateResponseDto> {

    final private PredefineTemplateService service;

    public PredefineTemplateController(BaseService<PredefineTemplate, PredefineTemplateRequestDto, PredefineTemplateResponseDto> service, PredefineTemplateService service1) {
        super(service);
        this.service = service1;
    }

    @PostMapping(path = PredefineTemplateConstant.PREDEFINE_TEMPLATE_UNIQUE, produces = "application/json")
    public Response<PredefineTemplateResponseDto> createFiscalYear(@RequestBody PredefineTemplateRequestDto predefineTemplateRequestDto) {
        return service.createPredefineTemplate(predefineTemplateRequestDto);
    }

    @PutMapping(path = PredefineTemplateConstant.UPDATE_PREDEFINE_TEMPLATE_UNIQUE, produces = "application/json")
    public Response<PredefineTemplateResponseDto> updateFiscalYear(@RequestBody PredefineTemplateRequestDto predefineTemplateRequestDto) {
        return service.updatePredefineTemplate(predefineTemplateRequestDto);
    }

    @GetMapping(path = PredefineTemplateConstant.GET_BY_TEMPLATE_TYPE_ID + "/{templateTypeId}", produces = "application/json")
    public Response<PredefineTemplateResponseDto> templateTypeId(@PathVariable Integer templateTypeId) {
        return service.getByTemplateTypeId(templateTypeId);
    }



    @GetMapping(path = PredefineTemplateConstant.GET_ALL_BY_ID_ACTIVE, produces = "application/json")
    public Response<PredefineTemplate> GEAllACTIVE(@PathVariable("id") Integer id) {
        Response<PredefineTemplate> response=service.getActiveById(id);
        return response;
    }


    @GetMapping(path = PredefineTemplateConstant.PREDEFINE_TEMPLATE_BY_ID, produces = "application/json")
    public Response<PredefineTemplateResponseDto> getById(@PathVariable Long id) {
        return service.findById(id);
    }
}
