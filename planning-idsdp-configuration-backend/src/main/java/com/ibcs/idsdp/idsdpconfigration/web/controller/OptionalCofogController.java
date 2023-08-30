package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.OptionalCofogConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.OptionalCofog;
import com.ibcs.idsdp.idsdpconfigration.services.OptionalCofogService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.OptionalCofogDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(OptionalCofogConstant.OPTIONAL_COFOG)
public class OptionalCofogController extends BaseController<OptionalCofog, OptionalCofogDTO> {

    private final OptionalCofogService service;

    public OptionalCofogController(BaseService<OptionalCofog, OptionalCofogDTO> baseService, OptionalCofogService service) {
        super(baseService);
        this.service = service;
    }

    // For Getting All Active Optional Cofog
    @PostMapping(path=OptionalCofogConstant.GET_ACTIVE_OPTIONAL_COFOG , produces = "application/json")
    public Page<OptionalCofogDTO> getActiveOptionalCofog(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return service.getActiveOptionalCofog(requestBodyDTO);
    }

    // For Getting All Active Optional Cofog by Main Cofog Id
    @GetMapping(path=OptionalCofogConstant.GET_BY_MAIN_COFOG_ID + "/{mainCofogId}" , produces = "application/json")
    public List<OptionalCofogDTO> getByMainCofogId(@PathVariable("mainCofogId") long mainCofogId) {
        return service.getByMainCofogId(mainCofogId);
    }
}