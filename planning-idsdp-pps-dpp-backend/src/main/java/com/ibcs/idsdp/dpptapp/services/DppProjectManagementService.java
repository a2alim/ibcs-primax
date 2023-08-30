package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagement;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppProjectManagementResponse;

public interface DppProjectManagementService {

 //   ResponseEntity<List<LogFrameDTO>> getActiveDivision();

    DppProjectManagementResponse getProjectManagementByPcUuid(String pcUuid) ;
    DppProjectManagementResponse updateProjectManagement(DppProjectManagementResponse response, String pcUuid);
}
