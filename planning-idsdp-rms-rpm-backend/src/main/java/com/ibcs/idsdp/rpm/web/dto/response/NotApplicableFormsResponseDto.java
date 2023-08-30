package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class NotApplicableFormsResponseDto extends UuidIdHolderRequestBodyDTO {
    private Long id;
    private Long m1ResearcherProfilePersonalInfoId;
    private String publicationInfo;
    private String proExperience;
    private String researchExp;
    private String trainingInfo;
    private String modelName;
    private String formName;
}
