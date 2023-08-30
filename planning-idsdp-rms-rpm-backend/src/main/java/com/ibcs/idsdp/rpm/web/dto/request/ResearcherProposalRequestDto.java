package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import lombok.Data;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Data
public class ResearcherProposalRequestDto extends UuidIdHolderRequestBodyDTO {

	@NotNull
	private Long resProfilePersonalInfoId;

	@NotNull
	private Long stFiscalYearId;

	@NotNull
	private Long stResearchCatTypeId;

	@NotNull
	private Long stSectorTypeId;

	private Long stSubSectorsId;

	@NotBlank
	private String researchTitle;

	private String researchTitleBangla;

	private String stSdgsGoalsId;

	private String nationalPlanAlignment;

	private Integer isCancelled;

	private String cancellationNote;

	private Long cancelledBy;

	private Integer isEditable;

	private Integer approvalStatus;

	private Integer approvedBy;

	private Boolean isFinalSubmit;

	private String divisionId;

	private String districtId;

	private String upzilaId;

	private String divisionName;

	private String districtName;

	private String upzilaName;
	
	private String proposalTopic;

}
