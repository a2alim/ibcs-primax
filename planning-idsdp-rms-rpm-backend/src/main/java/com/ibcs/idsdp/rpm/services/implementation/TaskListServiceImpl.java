package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import javax.transaction.Transactional;

import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.TaskList;
import com.ibcs.idsdp.rpm.model.repositories.TaskListRepository;
import com.ibcs.idsdp.rpm.services.TaskListService;
import com.ibcs.idsdp.rpm.web.dto.request.TaskListRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.TaskListResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class TaskListServiceImpl extends BaseService<TaskList, TaskListRequestDto, TaskListResponseDto> implements TaskListService {

	private final TaskListRepository taskListRepository;
	private final IdGeneratorComponent idGeneratorComponent;
	
	protected TaskListServiceImpl(ServiceRepository<TaskList> repository,
			TaskListRepository taskListRepository,
			IdGeneratorComponent idGeneratorComponent) {
		super(repository);
		this.taskListRepository = taskListRepository;
		this.idGeneratorComponent = idGeneratorComponent;
	}

	@Override
	public Response<List<TaskListResponseDto>> save(String body) {
		Response<List<TaskListResponseDto>> response = new Response<>();
		List<TaskListResponseDto> reobj = new ArrayList<>();
		

		TaskListRequestDto[] taskListRequestDtoArr = new Gson().fromJson(body, TaskListRequestDto[].class);
		List<TaskListRequestDto> list = Arrays.asList(taskListRequestDtoArr);
		for(TaskListRequestDto taskListRequestDto : list) {

			TaskList tl = new TaskList();

			if(StringUtils.isNotBlank(taskListRequestDto.getUuid())) {
				Optional<TaskList> result = taskListRepository.findByUuidAndIsDeleted(taskListRequestDto.getUuid(), false);
				if (!result.isPresent()) throw new ResourceNotFoundException("Task List Not Found");
				tl = result.get();
			}

			BeanUtils.copyProperties(taskListRequestDto, tl, "id", "uuid");

			// create task list
			if(StringUtils.isBlank(tl.getUuid())) {
				tl.setUuid(idGeneratorComponent.generateUUID());
			} else {
				tl.setUpdatedBy("admin");
				tl.setUpdatedOn(LocalDate.now());
			}
			tl.setCreatedBy("admin");
			tl.setCreatedOn(LocalDate.now());
			tl.setIsDeleted(false);

			try {
				taskListRepository.save(tl);
			} catch (Exception e) {
				log.error("ERROR is : {}, {}", e.getMessage(), e);
				response.setSuccess(false);
				response.setMessage("Can't create Task List");
				response.setObj(null);
				return response;
			}

			TaskListResponseDto responseDto = new TaskListResponseDto();
			BeanUtils.copyProperties(tl, responseDto);

			reobj.add(responseDto);
		}

		response.setSuccess(true);
		response.setMessage("Saved Successfully");
		response.setObj(reobj);
		return response;
	}

	@Override
	public List<TaskList> findAllTaskListByResearchProgressReportId(Long researchProgressReportId) {
		return taskListRepository.findAllTaskListByResearchProgressReportIdAndIsDeleted(researchProgressReportId, false);
	}

}
