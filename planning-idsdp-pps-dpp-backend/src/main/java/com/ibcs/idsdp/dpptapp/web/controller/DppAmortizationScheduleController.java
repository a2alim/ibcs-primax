package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DppAmortizationScheduleConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationSchedule;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationScheduleDetails;
import com.ibcs.idsdp.dpptapp.services.DppAmortizationScheduleService;
import com.ibcs.idsdp.dpptapp.web.dto.DppAmortizationScheduleDetailsDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAmortizationScheduleRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.Path;
import java.util.List;
import java.util.Optional;

@RestApiController
@RequestMapping(DppAmortizationScheduleConstant.dppAmortizationSchedule)

public class DppAmortizationScheduleController {
    private final DppAmortizationScheduleService dppAmortizationScheduleService;


    public DppAmortizationScheduleController(DppAmortizationScheduleService dppAmortizationScheduleService) {
        this.dppAmortizationScheduleService = dppAmortizationScheduleService;
    }

    // for create new amortization schedule
    @PostMapping(path = "createAmortizationSchedule", produces = "application/json")
    public DppAmortizationScheduleRequest createAmortizationSchedule(@RequestBody DppAmortizationScheduleRequest request){
        return this.dppAmortizationScheduleService.createAmortizationSchedule(request);
    }


    // for update amortization schedule
    @PutMapping(path = "updateAmortization/{uuid}")
    public DppAmortizationScheduleRequest updateAmortizationSchedule(@RequestBody DppAmortizationScheduleRequest request, @PathVariable("uuid") String uuid){
        return dppAmortizationScheduleService.updateAmortization(request, uuid);
    }

    // for get amortization schedule
    @GetMapping(path = "getAmortization/{uuid}")
    public ResponseWithResults getAmortizationSchedule(@PathVariable String uuid){
        return dppAmortizationScheduleService.getAmortizationSchedule(uuid);
    }


    // Report Controllers
    @GetMapping("report/{uuid}")
    public ResponseWithResults getAmortizationScheduleReport(@PathVariable String uuid){
        return dppAmortizationScheduleService.getAmortizationScheduleReport(uuid);
    }


}
