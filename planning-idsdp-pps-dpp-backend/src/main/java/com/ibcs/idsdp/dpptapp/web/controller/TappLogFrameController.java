package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.LogFrameConstant;
import com.ibcs.idsdp.dpptapp.model.domain.TappLogFrame;
import com.ibcs.idsdp.dpptapp.services.TappLogFrameService;
import com.ibcs.idsdp.dpptapp.web.dto.TappLogFrameDTO;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping(LogFrameConstant.TAPP_LOG_FRAME)
public class TappLogFrameController extends BaseController<TappLogFrame, TappLogFrameDTO> {

    private final TappLogFrameService tappLogFrameService;

    public TappLogFrameController(BaseService<TappLogFrame, TappLogFrameDTO> baseService, TappLogFrameService tappLogFrameService) {
        super(baseService);
        this.tappLogFrameService = tappLogFrameService;
    }


    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public TappLogFrameDTO create(@RequestBody TappLogFrameDTO tappLogFrameDTO) {
        return super.create(tappLogFrameDTO);
    }

    @GetMapping(path = LogFrameConstant.GET_TAPP_LOG_FRAME + '/'+"{pcUuid}")
    public ResponseWithResults getTappLogFrame(@PathVariable String pcUuid){
        return tappLogFrameService.getTappLogFrame(pcUuid);
    }

    @PutMapping(LogFrameConstant.UPDATE_TAPP_LOG_FRAME + '/'+"{pcUuid}")
    public TappLogFrameDTO updateFinancingExpectation(@RequestBody TappLogFrameDTO dto, @PathVariable String pcUuid){
        return tappLogFrameService.updateTappLogFrame(dto, pcUuid);
    }
}