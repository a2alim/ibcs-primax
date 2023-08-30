package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppProjectManagementSetupDto;
import org.springframework.http.ResponseEntity;

public interface DppProjectManagementSetupService {


    DppProjectManagementSetupDto createProjectSetup(DppProjectManagementSetupDto projectManagementSetupDto);

    ResponseWithResults getProjectSetupListByProject(String id);

//    List<DppProjectManagementSetup> getProjectManagementSetup(String id);

    DppProjectManagementSetupDto updateProjectSetup(DppProjectManagementSetupDto projectManagementSetupDto);

    String deleteProjectSetup(String projectId);

    ResponseEntity<ResponseStatus> deleteRow(String uuid);

    ResponseWithResults getProjectMannagementOrganogramAttachment(String uuid);


}
