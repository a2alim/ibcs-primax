package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class DppTappGoDto extends UuidIdHolderRequestBodyDTO {

    private String pcUuid;
    private String recordNo;
    private Date recordDate;
    private String ecnecMeetingInfo;
    private Date ecnecMeetingDate;
    private String projectOtherInfo;
    private String orderType;
    private String seniorAssistantHead;
    private String wing;
}
