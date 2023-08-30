package com.ibcs.idsdp.rpm.web.dto.request;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

@Data
public class EligibilityCheckerRequestDto extends UuidIdHolderRequestBodyDTO{	
	
	private String personName;
	private Long stResearchCatTypeId;
	private LocalDate dateOfBirth;	
	
	private String graduateResult;
	private Boolean isGovEmployee;
			
	
	private String postGraduateResult;
	private Boolean isThesisGroup;
	
	private Boolean isMPhil;
	private Boolean isPhD;
	
		
	private String totalResearchExperience;
	private String journalPublicationLocQty;	
	private String journalPublicationIntQty;	
	
	private Boolean isResearchTraining;
	private String nidNumber;
	private String nidVerificationStatus;

}
