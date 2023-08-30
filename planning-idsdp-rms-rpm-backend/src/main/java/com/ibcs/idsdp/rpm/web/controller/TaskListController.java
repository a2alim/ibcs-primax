package com.ibcs.idsdp.rpm.web.controller;

import java.util.List;

import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.TaskListConstant;
import com.ibcs.idsdp.rpm.model.domain.TaskList;
import com.ibcs.idsdp.rpm.services.TaskListService;
import com.ibcs.idsdp.rpm.web.dto.request.TaskListRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.TaskListResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(TaskListConstant.TASK_LIST)
public class TaskListController extends BaseController<TaskList, TaskListRequestDto, TaskListResponseDto>{

	final private TaskListService taskListService;

	public TaskListController(BaseService<TaskList, TaskListRequestDto, TaskListResponseDto> service,
			TaskListService taskListService) {
		super(service);
		this.taskListService = taskListService;
	}

	@PostMapping(TaskListConstant.SAVE)
	public Response<List<TaskListResponseDto>> save(@RequestBody String body){
		return taskListService.save(body);
	}

	@PostMapping(TaskListConstant.UPDATE)
	public Response<List<TaskListResponseDto>> update(@RequestBody String body){
		return taskListService.save(body);
	}

	
}
