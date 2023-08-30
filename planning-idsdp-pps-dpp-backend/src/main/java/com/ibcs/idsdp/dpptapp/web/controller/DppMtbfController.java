package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DppMtbfConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppMtbf;
import com.ibcs.idsdp.dpptapp.services.DppMtbfService;
import com.ibcs.idsdp.dpptapp.web.dto.DppMtbfDTO;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestApiController
@RequestMapping(DppMtbfConstant.DPP_MTBF)
public class DppMtbfController extends BaseController<DppMtbf, DppMtbfDTO> {

    private final DppMtbfService dppMtbfService;

    public DppMtbfController(BaseService<DppMtbf, DppMtbfDTO> baseService, DppMtbfService dppMtbfService) {
        super(baseService);
        this.dppMtbfService = dppMtbfService;
    }

    @GetMapping(path= DppMtbfConstant.GET_BY_PC_UUID + "/{pcUuid}" , produces = "application/json")
    public DppMtbfDTO getDppMtbfByPcUuid(@PathVariable String pcUuid) {
        return dppMtbfService.getDppMtbfByPcUuid(pcUuid);
    }
}
