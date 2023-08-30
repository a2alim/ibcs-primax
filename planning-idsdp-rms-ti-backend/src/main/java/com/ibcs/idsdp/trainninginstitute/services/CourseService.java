package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.CourseModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CourseRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface CourseService {
    ResponseEntity<ApiResponse<Long>> addCourse(CourseRequest courseRequest);

    ResponseEntity<PaginationResponse<List<CourseModel>>> getCourseList(int pageNo, int pageSize, String courseTitle);

    ResponseEntity<ApiMessageResponse> deleteCourse(Long courseId);

    ResponseEntity<ApiMessageResponse> editCourse(CourseRequest courseRequest, Long courseId);

    ResponseEntity<CourseModel> getSingleCourse(Long courseId);

    ResponseEntity<List<CourseScheduleModel>>  getAllCourseScheduleBy(Long courseScheduleId);

    ResponseEntity<CourseModel> getCourseByProposalId(Long proposalId);
}
