package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EcnecMeetingRequest extends UuidIdHolderRequestBodyDTO {

    private String meetingName;
    private String description;
    private LocalDate meetingDate;
    private String meetingTime;
    private String meetingVenue;
    private boolean status;
    private boolean meetingStatus;
    private String fileUrl;

}
