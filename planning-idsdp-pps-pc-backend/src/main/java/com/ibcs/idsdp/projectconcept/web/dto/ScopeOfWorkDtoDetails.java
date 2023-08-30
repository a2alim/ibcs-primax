package com.ibcs.idsdp.projectconcept.web.dto;

import lombok.Data;

import java.util.Date;

@Data
public class ScopeOfWorkDtoDetails {
    private Long taskType;
    private String taskDetails;
    private Date startDate;
    private Date endDate;
    private Long attachmentId;
    private String attachmentName;
    private Long projectConceptMasterId;
    private String uuid;
}
