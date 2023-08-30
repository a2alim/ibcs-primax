package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.web.dto.request.ProjectInfoToGisRequestDTO;

public interface ProjectInfoToGisService {
    ResponseStatus getProjectInfoToGisByIdAndType(ProjectInfoToGisRequestDTO requestDTO);
}
