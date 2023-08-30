package com.ibcs.idsdp.feasibilitystudy.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class VisitPlanDTO extends UuidIdHolderRequestBodyDTO {

    private String taskDetails;

    private Date startDate;

    private Date endDate;

    private String location;

    private String remarks;

    private Long fspMasterId;
}
