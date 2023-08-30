package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ProjectMovementDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ProjectMoveRequest;
import org.springframework.data.domain.Page;

import java.util.List;

public interface ProjectMovementService {

    Page<ProjectMovementDTO> getActiveProjectMovement(PageableRequestBodyDTO pageableRequestBodyDTO);

    Page<ProjectMovementDTO> getProjectMovementByOrderId(PageableRequestBodyDTO pageableRequestBodyDTO);

    void moveProject(ProjectMoveRequest projectMoveRequest);

    List<ProjectMovementDTO> getProjectMovementByOrderIdAndModule(Long moduleId);
}
