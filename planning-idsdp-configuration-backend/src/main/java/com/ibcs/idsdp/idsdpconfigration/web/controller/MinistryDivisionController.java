package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.AgencyConstant;
import com.ibcs.idsdp.idsdpconfigration.constants.MinistryDivisionConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MinistryDivision;
import com.ibcs.idsdp.idsdpconfigration.services.MinistryDivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.MinistryDivisionDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;


@RestApiController
@RequestMapping(MinistryDivisionConstant.MINISTRY_DIVISION)
public class MinistryDivisionController extends BaseController<MinistryDivision, MinistryDivisionDTO> {

    private final MinistryDivisionService ministryDivisionService;

    public MinistryDivisionController(BaseService<MinistryDivision, MinistryDivisionDTO> baseService,
                                      MinistryDivisionService ministryDivisionService) {
        super(baseService);
        this.ministryDivisionService = ministryDivisionService;
    }

    // For Getting All Active Ministry Division
    @PostMapping(path=MinistryDivisionConstant.GET_ACTIVE_MINISTRY_DIVISION , produces = "application/json")
    public Page<MinistryDivisionDTO> getActiveMinistryDivision(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return ministryDivisionService.getActiveMinistryDivision(requestBodyDTO);
    }

    @GetMapping(path = AgencyConstant.GET_BY_NAME_EN  + "/{nameEn}", produces = "application/json")
    public MinistryDivisionDTO getByNameEn(@PathVariable("nameEn") String nameEn) {
        return ministryDivisionService.getByNameEn(nameEn);
    }

    @GetMapping(path = AgencyConstant.GET_BY_CODE  + "/{code}", produces = "application/json")
    public MinistryDivisionDTO getByCode(@PathVariable("code") String code) {
        return ministryDivisionService.getByCode(code);
    }
}
