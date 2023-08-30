package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppLocationConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLocation;
import com.ibcs.idsdp.rdpprtapp.services.DppLocationService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppLocationDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppLocationResponse;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.LocationAndCostResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(DppLocationConstant.LOCATION)
public class DppLocationController extends BaseController<DppLocation, DppLocationDTO> {

    private final DppLocationService service;

    public DppLocationController(BaseService<DppLocation, DppLocationDTO> baseService, DppLocationService service) {
        super(baseService);
        this.service = service;
    }

    @GetMapping(path = DppLocationConstant.GET_BY_PROJECT_SUMMARY_ID + "/{projectSummaryId}" , produces = "application/json")
    public DppLocationResponse getProjectSummaryByGoB(@PathVariable Long projectSummaryId) {
        return service.getByProjectSummaryId(projectSummaryId);
    }

    @GetMapping(path = DppLocationConstant.GET_BY_OBJECTIVE_AND_COST_ID_USING_PROJECT_SUMMARY + "/{projectSummaryId}" , produces = "application/json")
    public LocationAndCostResponse getLocationByObjectiveCostId(@PathVariable Long projectSummaryId) {
        return service.getLocationByObjectiveCostIdUsingProjectSummary(projectSummaryId);
    }


}
