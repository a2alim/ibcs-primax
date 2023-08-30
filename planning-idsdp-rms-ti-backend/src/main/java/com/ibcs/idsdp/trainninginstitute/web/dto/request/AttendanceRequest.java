package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;

import java.time.LocalDate;
import java.util.List;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttendanceRequest {

    private Long proposalId;

    private LocalDate date;

    private Long speakerId;

    private Long sessionId;

    private List<ParticipantAttendanceRequest> participantAttendanceModels;

    private Boolean editable;
    private MinioAttachment attendancePhoto;
}
