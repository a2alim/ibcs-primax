package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.DetailsCofogConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.DetailsCofog;
import com.ibcs.idsdp.idsdpconfigration.services.DetailsCofogService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.DetailsCofogDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(DetailsCofogConstant.DETAILS_COFOG)
public class DetailsCofogController extends BaseController<DetailsCofog, DetailsCofogDTO> {

    private final DetailsCofogService detailsCofogService;

    public DetailsCofogController(BaseService<DetailsCofog, DetailsCofogDTO> baseService, DetailsCofogService detailsCofogService) {
        super(baseService);
        this.detailsCofogService = detailsCofogService;
    }

    // For Getting All Active Details Cofog
    @PostMapping(path= DetailsCofogConstant.GET_ACTIVE_DETAILS_COFOG, produces = "application/json")
    public Page<DetailsCofogDTO> getActiveDetailsCofog(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return detailsCofogService.getActiveDetailsCofog(requestBodyDTO);
    }

    // For Getting All Details Cofog by Optional Cofog Id
    @GetMapping(path= DetailsCofogConstant.GET_BY_OPTIONAL_COFOG_ID + "/{optionalCofogId}", produces = "application/json")
    public List<DetailsCofogDTO> getByOptionalCofog(@PathVariable("optionalCofogId") long optionalCofogId) {
        return detailsCofogService.getByOptionalCofog(optionalCofogId);
    }
}