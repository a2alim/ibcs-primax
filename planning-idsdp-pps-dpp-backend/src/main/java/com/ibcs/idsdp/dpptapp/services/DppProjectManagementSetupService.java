package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagementSetup;
import com.ibcs.idsdp.dpptapp.web.dto.DppProjectManagementDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppProjectManagementSetupDto;
import org.springframework.http.ResponseEntity;

import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.List;

public interface DppProjectManagementSetupService {


    DppProjectManagementSetupDto createProjectSetup(DppProjectManagementSetupDto projectManagementSetupDto);

    ResponseWithResults getProjectSetupListByProject(String id) throws IOException;

//    List<DppProjectManagementSetup> getProjectManagementSetup(String id);

    DppProjectManagementSetupDto updateProjectSetup(DppProjectManagementSetupDto projectManagementSetupDto);

    String deleteProjectSetup(String projectId);

    ResponseEntity<ResponseStatus> deleteRow(String uuid);

    ResponseWithResults getProjectMannagementOrganogramAttachment(String uuid);


}
