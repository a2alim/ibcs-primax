package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class AssignEcnecMeetingRequest extends UuidIdHolderRequestBodyDTO {

    private String pcUuid;
    private Long pcId;
    private Long ecnecMeetingId;

}
