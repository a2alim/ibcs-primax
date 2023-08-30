package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.TappObjectiveCostConstant;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.services.TappObjectiveCostService;
import com.ibcs.idsdp.dpptapp.web.dto.TappObjectiveCostDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@RestApiController
@RequestMapping(TappObjectiveCostConstant.TAPP_OBJECTIVE_COST)
public class TappObjectiveCostController extends BaseController<TappObjectiveCost, TappObjectiveCostDTO> {

    private final TappObjectiveCostService tappObjectiveCostService;

    public TappObjectiveCostController(BaseService<TappObjectiveCost, TappObjectiveCostDTO> baseService, TappObjectiveCostService tappObjectiveCostService) {
        super(baseService);
        this.tappObjectiveCostService = tappObjectiveCostService;
    }

    @PostMapping(path = "save", produces = "application/json")
    public ResponseWithResults createObjectiveCost(@RequestBody TappObjectiveCostDTO tappObjectiveCostDTO) {
        return tappObjectiveCostService.createObjectiveCost(tappObjectiveCostDTO);
    }

    @PostMapping(path = "update", produces = "application/json")
    public ResponseWithResults updateObjectiveCost(@RequestBody TappObjectiveCostDTO tappObjectiveCostDTO) {
        return tappObjectiveCostService.updateObjectiveCost(tappObjectiveCostDTO);
    }

    @GetMapping(path = "/get-by-PcUuid/{pcUuid}")
    public ResponseWithResults getByPcUuid(@PathVariable String pcUuid) {
        return tappObjectiveCostService.getByPcUuid(pcUuid);
    }

    @DeleteMapping("/deleteRow/{uuid}")
    public ResponseEntity<ResponseStatus> deleteRow(@PathVariable String uuid) {
        return tappObjectiveCostService.deleteRow(uuid);
    }

    // all tapp objective and cost master data
    @GetMapping(path = "get-tapp-master-data", produces = "application/json")
    public List<TappObjectiveCostDTO> getObjectiveCostList() {
        return tappObjectiveCostService.getObjectiveCostList();
    }

    // tapp objective and cost master data by project concept uuid
    @GetMapping(path = "get-tapp-master-data/{pcUuid}", produces = "application/json")
    public TappObjectiveCostDTO getObjectiveCostByPcUuid(@PathVariable String pcUuid) {
        return tappObjectiveCostService.getObjectiveCostByPcUuid(pcUuid);
    }

}