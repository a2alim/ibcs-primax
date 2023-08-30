package com.ibcs.idsdp.rpm.services;

import java.util.List;

import com.ibcs.idsdp.rpm.model.domain.TaskList;
import com.ibcs.idsdp.rpm.web.dto.response.TaskListResponseDto;
import com.ibcs.idsdp.util.Response;

public interface TaskListService {

	public Response<List<TaskListResponseDto>> save(String body);

	public List<TaskList> findAllTaskListByResearchProgressReportId(Long researchProgressReportId);
}
