package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import com.ibcs.idsdp.trainninginstitute.model.domain.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceResponse {

    private ProposalModel proposalModel;

//    private Long proposalId;

    private LocalDate date;

    private Trainer trainer;

    private CourseScheduleModel courseScheduleModel;

    private List<ParticipantAttendanceModel> participantAttendanceModels;

    private boolean editable;

    private CourseModel courseModel;

    private MinioAttachment attendancePhoto;

}
