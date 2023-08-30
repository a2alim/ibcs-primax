package com.ibcs.idsdp.dpptapp.services.projectSummariesService;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppAmortizationScheduleDetails;
import com.ibcs.idsdp.dpptapp.model.domain.projectSummaries.YearWiseCost;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAmortizationScheduleRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.projectSummariesDto.ProjectSummariesDto;

import java.util.List;

public interface ProjectSummariesService {

    ProjectSummariesDto createProjectSummaries(ProjectSummariesDto request);

    ProjectSummariesDto updateProjectSummaries(ProjectSummariesDto dto, String uuid, String summariesType);

    ResponseWithResults getProjectSummaries(String pcUuid, String summariesType);

    List<YearWiseCost> getYearWiseCost(Long id);
}
