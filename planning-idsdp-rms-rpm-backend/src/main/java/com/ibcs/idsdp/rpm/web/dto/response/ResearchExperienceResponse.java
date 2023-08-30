package com.ibcs.idsdp.rpm.web.dto.response;

import lombok.Data;

@Data
public class ResearchExperienceResponse {
	private long profilePersonalInfoId;
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
}
