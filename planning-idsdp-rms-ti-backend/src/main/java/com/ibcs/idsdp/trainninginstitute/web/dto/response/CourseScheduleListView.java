package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import lombok.*;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class CourseScheduleListView {

    private String session;

    private String topic;

    private LocalDate date;

    private String day;

    private String time;

    private List<CourseScheduleSpeaker> courseScheduleSpeakerList;
}
