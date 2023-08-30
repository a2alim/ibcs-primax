package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.LocationCountDTO;

public interface IAgencyDashboardService {
    AgencyDashboardDTO getAgencyDashboardData();
    LocationCountDTO getDashboardLocationData();
}
