package com.ibcs.idsdp.dpptapp.web.dto.request;

import lombok.Data;

@Data
public class DppPMSExistingRequest {


    private String projectConceptUuid;
    private Long projectConceptId;
    private String nameOfThePost;
    private Double quantity;
    private String qualification;
    private String modeOfRecruitment;
    private String scale_amount;
    private String payGrade;
    private String responsibility;
    private String remarks;
    private String types;
    private String uuid;

}
