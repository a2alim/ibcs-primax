package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppAmortizationScheduleConstant;
import com.ibcs.idsdp.rdpprtapp.services.DppAmortizationScheduleService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppAmortizationScheduleRequest;
import org.springframework.web.bind.annotation.*;

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
    @PutMapping(path = "updateAmortization/{id}")
    public DppAmortizationScheduleRequest updateAmortizationSchedule(@RequestBody DppAmortizationScheduleRequest request, @PathVariable("id") Long id){
        return dppAmortizationScheduleService.updateAmortization(request, id);
    }

    // for get amortization schedule
    @GetMapping(path = "getAmortization/{rdppId}")
    public ResponseWithResults getAmortizationSchedule(@PathVariable Long rdppId){
        return dppAmortizationScheduleService.getAmortizationSchedule(rdppId);
    }


    // Report Controllers
    @GetMapping("report/{id}")
    public ResponseWithResults getAmortizationScheduleReport(@PathVariable Long id){
        return dppAmortizationScheduleService.getAmortizationScheduleReport(id);
    }


}
