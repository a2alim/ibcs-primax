package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.AssignEcnecMeetingConstant;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.DppTappGo;
import com.ibcs.idsdp.dpptapp.services.AssignEcnecMeetingService;
import com.ibcs.idsdp.dpptapp.services.DppTappGoService;
import com.ibcs.idsdp.dpptapp.web.dto.request.AssignEcnecMeetingRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppTappGoDto;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestApiController
@RequestMapping("dpp-tapp-go")
public class DppTappGoController extends BaseController<DppTappGo, DppTappGoDto> {

    private final DppTappGoService dppTappGoService;

    public DppTappGoController(BaseService<DppTappGo, DppTappGoDto> service, DppTappGoService dppTappGoService) {
        super(service);
        this.dppTappGoService = dppTappGoService;
    }

    @PostMapping(value = "/create-go-ao", produces = "application/json")
    public DppTappGo createOrUpdate(@RequestBody DppTappGoDto request){
        return dppTappGoService.createOrUpdate(request);
    }

    @GetMapping(value = "/find-by/{pcUuid}/{orderType}", produces = "application/json")
    public DppTappGo findByPcUuidAndOrderType(@PathVariable String pcUuid, @PathVariable String orderType){
        return dppTappGoService.findByPcUuidAndOrderType(pcUuid, orderType);
    }

    @DeleteMapping("/delete-by-/{pcUuid}/{orderType}")
    public ResponseEntity<ResponseStatus> deleteDppTappGo(@PathVariable String pcUuid, @PathVariable String orderType){
        return dppTappGoService.deleteDppTappGo(pcUuid, orderType);
    }

}
