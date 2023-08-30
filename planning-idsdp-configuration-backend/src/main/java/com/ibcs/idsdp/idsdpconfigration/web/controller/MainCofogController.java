package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.MainCofogConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MainCofog;
import com.ibcs.idsdp.idsdpconfigration.services.MainCofogService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.MainCofogDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(MainCofogConstant.MAIN_COFOG)
public class MainCofogController extends BaseController<MainCofog, MainCofogDTO> {

    private final MainCofogService mainCofogService;

    public MainCofogController(BaseService<MainCofog, MainCofogDTO> baseService, MainCofogService mainCofogService) {
        super(baseService);
        this.mainCofogService = mainCofogService;
    }

    // For Getting All Active Main Cofog
    @PostMapping(path=MainCofogConstant.GET_ACTIVE_MAIN_COFOG , produces = "application/json")
    public Page<MainCofogDTO> getActiveMainCofog(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return mainCofogService.getActiveMainCofog(requestBodyDTO);
    }
}