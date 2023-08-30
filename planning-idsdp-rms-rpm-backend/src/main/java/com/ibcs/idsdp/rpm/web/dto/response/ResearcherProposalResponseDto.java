package com.ibcs.idsdp.rpm.web.dto.response;

import java.util.List;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SubSectorResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;

import lombok.Data;

@Data
public class ResearcherProposalResponseDto extends UuidIdHolderRequestBodyDTO {

	private Long resProfilePersonalInfoId;
	private Long stFiscalYearId;
	private Long stResearchCatTypeId;
	private Long stSectorTypeId;
	private Long stSubSectorsId;

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

	private FiscalResponseDto fiscalYear;
	private SectorTypeResponseDto sector;
	private SubSectorResponseDto subSector;
	private ResearchCategoryTypeResponseDto researchCategoryType;
	private ResearcherProfilePersonalInfoMasterResponse researcherProfilePersonalInfoDto;
	private ResearcherSupervisorInfoResponseDto researcherSupervisorInfoResponseDto;
	private String instituteName;
	private ResearcherProfilePersonalInfoMasterResponse researcherProfilePersonalInfoMaster;
	private AgreementWithResearcherResponseDto agreementWithResearcherResponseDto;
	private List<AgreementInstallmentResponseDto> agreementInstallmentResponseDtoList;
	private List<ResearcherPresentationResponseDto> researcherPresentationResponseDtoList;
	// Added By Rakib For Report
	private String stProfileOfExpertEvaluator;
	private String stProfileOfExpertEvaluatorForProMarks;
	private String proposalTopic;
	private String proposalUuid;

}
