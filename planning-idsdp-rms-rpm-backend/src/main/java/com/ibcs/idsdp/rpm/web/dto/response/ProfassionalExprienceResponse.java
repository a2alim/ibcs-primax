package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

import java.util.Date;

@Data
public class ProfassionalExprienceResponse {
    private  long profilePersonalInfoId;

    private String organizationName;

    private String designation;

    private Integer isGovEmployee; // 1=Govt, 2=Private, 0=Other

    private Date fromDate;

    private Date toDate;

    private Boolean isContinue;

    private String responsibilityDetail;

    private Boolean isEditable;

}
