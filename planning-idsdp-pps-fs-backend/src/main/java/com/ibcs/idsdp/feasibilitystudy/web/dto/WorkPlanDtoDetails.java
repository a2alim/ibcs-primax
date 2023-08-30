package com.ibcs.idsdp.feasibilitystudy.web.dto;

import lombok.Data;

import java.util.Date;

@Data
public class WorkPlanDtoDetails {

    private String taskDetails;

    private Long committeeId;

    private Long vendorId;

    private Date startDate;

    private Date endDate;

    private String status;

    private Long fspMasterId;

    private String uuid;
}
