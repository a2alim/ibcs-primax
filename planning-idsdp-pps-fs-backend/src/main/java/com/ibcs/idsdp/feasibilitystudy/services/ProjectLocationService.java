package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.response.ProjectLocationResponse;

public interface ProjectLocationService {

    ProjectLocationResponse getByProjectConceptId(Long fsrMasterId,Long pcMasterId);
}
