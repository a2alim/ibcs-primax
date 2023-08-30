package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.LogFrameConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.rdpprtapp.services.LogFrameService;
import com.ibcs.idsdp.rdpprtapp.web.dto.LogFrameDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.LogFrameResponse;
import org.springframework.web.bind.annotation.*;


@RestApiController
@RequestMapping(LogFrameConstant.LOGFRAME)
public class LogFrameController extends BaseController<DppLogFrame, LogFrameDTO> {

    private final LogFrameService logFrameService;

    public LogFrameController(BaseService<DppLogFrame, LogFrameDTO> baseService, LogFrameService logFrameService) {
        super(baseService);
        this.logFrameService = logFrameService;
    }

    /**
     * Get By Pcid
     * @param pcId
     * @return
     */
    @GetMapping("/getByPcid/{pcId}")
    public DppLogFrame getByPcid(@PathVariable Long pcId) {
        System.out.println(pcId);
        return logFrameService.getLogFrameByPcid(pcId);
    }

    @GetMapping(path = "/getLogFrame/{pcUuid}")
    public ResponseWithResults getLogFrame(@PathVariable String pcUuid){
        return logFrameService.getLogFrame(pcUuid);
    }

    @GetMapping(path = "/getLogFrameById/{id}")
    public ResponseWithResults getLogFrameById(@PathVariable Long id){
        return logFrameService.getLogFrameById(id);
    }

    @PutMapping(path = "/updateLogFrame/{id}")
    public LogFrameResponse updateLogFrame(@RequestBody LogFrameResponse response, @PathVariable Long id){
        return logFrameService.updateLogFrame(response, id);
    }
}
