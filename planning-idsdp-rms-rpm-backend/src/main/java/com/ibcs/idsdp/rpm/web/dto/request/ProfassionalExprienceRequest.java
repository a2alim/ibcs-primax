package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

import java.util.Date;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class ProfassionalExprienceRequest {
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
