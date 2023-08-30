package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.AgencyDashboardConstant;
import com.ibcs.idsdp.projectconcept.services.IAgencyDashboardService;
import com.ibcs.idsdp.projectconcept.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.LocationCountDTO;
import lombok.AllArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(AgencyDashboardConstant.AGENCY_DASHBOARD)
@AllArgsConstructor
public class AgencyDashboardController {

    private final IAgencyDashboardService agencyDashboardService;

    @GetMapping(path = "", produces = "application/json")
    public AgencyDashboardDTO getAgencyDashboardData() {
        return agencyDashboardService.getAgencyDashboardData();
    }

    @GetMapping(path = AgencyDashboardConstant.GET_LOCATION_COUNT_DATA, produces = "application/json")
    public LocationCountDTO getDashboardLocationData() {
        return agencyDashboardService.getDashboardLocationData();
    }
}
