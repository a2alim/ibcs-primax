package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

import java.util.List;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class CourseRequest {

//    private String courseTitle;

    private Long proposalId;

    private int totalHours;

    private String programDuration;

    private String comment;

    private Long fiscalYearId;

    private List<CourseScheduleRequest> courseSchedules;

}
