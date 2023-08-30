package com.ibcs.idsdp.trainninginstitute.web.controller;

import java.util.List;

import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.services.CourseScheduleAppService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CourseScheduleRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.CourseScheduleResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;

@RestController
@RequestMapping("course-schedule")
public class CourseScheduleAppController
		extends BaseController<CourseScheduleModel, CourseScheduleRequest, CourseScheduleResponse> {

	private final CourseScheduleAppService courseScheduleAppService;

	public CourseScheduleAppController(
			BaseService<CourseScheduleModel, CourseScheduleRequest, CourseScheduleResponse> service,
			CourseScheduleAppService courseScheduleSAppService) {
		super(service);
		this.courseScheduleAppService = courseScheduleSAppService;
	}

	@GetMapping()
	public ResponseEntity<PaginationResponse<List<CourseScheduleModel>>> getCourseScheduleList(
			@RequestParam(required = false) String instituteName, @RequestParam(defaultValue = "0") int pageNo,
			@RequestParam(defaultValue = "25") int pageSize, @RequestParam("proposalId") Long proposalId) {

		return courseScheduleAppService.getCourseScheduleList(instituteName, pageNo, pageSize, proposalId);
	}

	@GetMapping("/by-proposal-id/{proposalId}")
	public Response<CourseScheduleModel> getByProposalId(@PathVariable Long proposalId) {

		return courseScheduleAppService.getByProposalId(proposalId);

	}

}
