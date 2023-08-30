package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

/**
 * @author moniruzzaman.rony
 * @create 10/12/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Data
public class ResearchExperienceRequest {
    Long id;
    long profilePersonalInfoId;
    private String fundingOrganization;
    private String researchType;
    private String researchTopic;
    private String researchYear;
    private String supervisorDetail;
    private String researchStatus;
    private String researchValueInBDT;
    private String researchFindingAndImportance;
    private Integer totalResearchExp;
    private Boolean isEditable;
    private Boolean isForeign;
    private Integer isDeleted = 0;
}
