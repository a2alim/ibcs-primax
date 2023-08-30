package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

import java.util.List;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class ResearchProfileWithRelatedInfoResponse extends ResearcherProfilePersonalInfoMasterResponse {

    private Integer totalResearch;

    private Integer employeeType;

    private List<EducationInfoResponse> educationInfoList;
}
