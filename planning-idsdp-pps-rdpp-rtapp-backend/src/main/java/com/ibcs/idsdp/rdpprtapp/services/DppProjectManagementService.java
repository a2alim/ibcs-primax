package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppProjectManagementResponse;

public interface DppProjectManagementService {

 //   ResponseEntity<List<LogFrameDTO>> getActiveDivision();

    DppProjectManagementResponse getProjectManagementById(Long id);
    DppProjectManagementResponse getProjectManagementByPcUuid(String pcUuid) ;
    DppProjectManagementResponse updateProjectManagement(DppProjectManagementResponse response, Long id);
}
