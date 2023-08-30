package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.StCategoryWiseActionPlan;
import com.ibcs.idsdp.rpm.services.StCategoryWiseActionPlanService;
import com.ibcs.idsdp.rpm.web.dto.request.StCategoryWiseActionPlanRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.APIResponse;
import com.ibcs.idsdp.rpm.web.dto.response.StCategoryWiseActionPlanResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.*;

@RestApiController
@AllArgsConstructor
@RequestMapping("api/cat-wise-action-plan")
public class StCategoryWiseActionPlanController  {

    private final StCategoryWiseActionPlanService stCategoryWiseActionPlanService;

    @PostMapping(value = "/create-or-update", produces = "application/json")
    public Response saveActionPlan(@RequestBody StCategoryWiseActionPlanRequestDto requestDto) {
        return stCategoryWiseActionPlanService.saveActionPlanName(requestDto);
    }

    @DeleteMapping("delete/{actionPlanId}")
    public Response deleteActionPlan(@PathVariable Long actionPlanId){
        return stCategoryWiseActionPlanService.deleteActionPlanName(actionPlanId);
    }

    @GetMapping("/get-by-cat-id/{stFiscalYearId}/{stResearchCatId}")
    public Response<StCategoryWiseActionPlanResponseDto> getActionPlanByCatId(@PathVariable Long stFiscalYearId, @PathVariable Long stResearchCatId){
        return stCategoryWiseActionPlanService.getActionPlanByCatId(stFiscalYearId, stResearchCatId);
    }

    @GetMapping("/get-list/{offset}/{pageSize}")
    public APIResponse<Page<StCategoryWiseActionPlan>> getAllActionPlanList(@PathVariable int offset, @PathVariable int pageSize){

        Page<StCategoryWiseActionPlan> plans = stCategoryWiseActionPlanService.getAll(offset, pageSize);
        return new APIResponse<>(plans.getSize(), plans);
    }
}
