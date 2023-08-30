package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.services.TappWorkScheduleService;
import com.ibcs.idsdp.dpptapp.web.dto.TappWorkScheduleDto;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@AllArgsConstructor
@RestController
@RequestMapping("/work-plan")
public class TappWorkScheduleController {

    private TappWorkScheduleService tappWorkScheduleService;

    /**
     *
     * @param request
     * @return
     */
    @PostMapping(path = "/save-work-plan", produces = "application/json")
    public ResponseWithResults saveWorkPlanList(@RequestBody List<TappWorkScheduleDto> request) {
            return tappWorkScheduleService.saveWorkPlanList(request);
    }

    /**
     *
     * @param rtappMasterId
     * @return
     */
    @GetMapping(path = "/get-work-plan-list" + "/{rtappMasterId}", produces = "application/json")
    public ResponseWithResults getAllWorkPlan(@PathVariable Long rtappMasterId) {
        return tappWorkScheduleService.getAllWorkPlan(rtappMasterId);
    }

    /**
     *
     * @param id
     * @return
     */
    @DeleteMapping("/delete-by-id/{id}")
    public ResponseWithResults deleteWorkPlan(@PathVariable Long id) {
        return tappWorkScheduleService.deleteWorkPlan(id);
    }
}

