package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CourseScheduleAppService {

    ResponseEntity<PaginationResponse<List<CourseScheduleModel>>> getCourseScheduleList(String instituteName, int pageNo, int pageSize, Long proposalId);

    Response<CourseScheduleModel> getByProposalId(Long proposalId);
}
