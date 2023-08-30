package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class EcnecMeetingResponse extends UuidIdHolderRequestBodyDTO {

    private String pcUuid;
    private String meetingName;
    private String description;
    private LocalDate meetingDate;
    private String meetingTime;
    private String meetingVenue;
    private boolean status;
    private String fileUrl;

}
