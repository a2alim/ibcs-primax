package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import lombok.*;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ParticipantAttendanceRequest {

    private Long participantId;

    private Boolean isPresent;

    private String speakerComment;
}
