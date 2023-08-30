package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class TappWorkScheduleDto extends UuidIdHolderRequestBodyDTO {

    private Long tappMasterId;
    private String taskDetails;
    private String itemName;
    private Date startDate;
    private Date endDate;
    private String status;
    private Long groupId;
    private String selectedQuarter;

}
