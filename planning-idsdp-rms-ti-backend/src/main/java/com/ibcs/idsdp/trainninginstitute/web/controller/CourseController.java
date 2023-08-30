package com.ibcs.idsdp.trainninginstitute.web.controller;

import com.ibcs.idsdp.trainninginstitute.model.domain.CourseModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.services.CourseService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.CourseRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("course-schedules")
public class CourseController {  
	
	private final CourseService courseService;

    @PostMapping
    public ResponseEntity<ApiResponse<Long>> addCourse(@RequestBody CourseRequest courseRequest) {
        return courseService.addCourse(courseRequest);
    }

    @GetMapping
    public ResponseEntity<PaginationResponse<List<CourseModel>>> getCourseList(@RequestParam(defaultValue = "0") int pageNo,
                                                                               @RequestParam(defaultValue = "25") int pageSize,
                                                                               @RequestParam(required = false) String courseTitle) {
        return courseService.getCourseList(pageNo, pageSize, courseTitle);
    }

    @DeleteMapping("/{courseId}")
    public ResponseEntity<ApiMessageResponse> deleteCourse(@PathVariable Long courseId) {
        return courseService.deleteCourse(courseId);
    }

    @PutMapping("/{courseId}")
    public ResponseEntity<ApiMessageResponse> editCourse(@PathVariable Long courseId, @RequestBody CourseRequest courseRequest) {
        return courseService.editCourse(courseRequest, courseId);
    }


    @GetMapping("/{courseId}")
    public ResponseEntity<CourseModel> getSingleCourse(@PathVariable Long courseId) {
        return courseService.getSingleCourse(courseId);
    }

    @GetMapping("/view/listData/{courseScheduleId}")
    public ResponseEntity<List<CourseScheduleModel>>  getAllCourseSchedule(@PathVariable Long courseScheduleId){
        return courseService.getAllCourseScheduleBy(courseScheduleId);
    }

    @GetMapping("/proposal/{proposalId}")
    public ResponseEntity<CourseModel> getCourseByProposalId(@PathVariable Long proposalId){
        return courseService.getCourseByProposalId(proposalId);
    }
}
