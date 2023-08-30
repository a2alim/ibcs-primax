package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.MafSafConstant;
import com.ibcs.idsdp.dpptapp.model.domain.MafSaf;
import com.ibcs.idsdp.dpptapp.services.MafSafService;
import com.ibcs.idsdp.dpptapp.web.dto.MafSafDTO;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;


@RestApiController
@RequestMapping(MafSafConstant.MAF_SAF)
public class MafSafController extends BaseController<MafSaf, MafSafDTO> {

    private final MafSafService mafSafService;

    public MafSafController(BaseService<MafSaf, MafSafDTO> baseService, MafSafService mafSafService) {
        super(baseService);
        this.mafSafService = mafSafService;
    }

    @GetMapping(path= MafSafConstant.GET_BY_PC_UUID + "/{pcUuid}/{type}" , produces = "application/json")
    public MafSafDTO getMafSafByPcUuidAndType(@PathVariable String pcUuid, @PathVariable String type) {
        return mafSafService.getMafSafByPcUuidAndType(pcUuid, type);
    }
}
