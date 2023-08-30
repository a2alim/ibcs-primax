package com.ibcs.idsdp.idsdpconfigration.services;

import com.ibcs.idsdp.idsdpconfigration.web.dto.ProjectTypeDTO;

import java.util.List;

public interface ProjectTypeService {

    List<ProjectTypeDTO> getActiveProjectType();

    ProjectTypeDTO getByNameEn(String nameEn);
}
