package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.Id;
import javax.persistence.Table;
import javax.persistence.Transient;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;

import lombok.Data;

@Table(name = "view_researcher_list")
@Entity
@Data
public class ViewResearcherList {

	/* proposal start */
	@Id
	private Long proposalId;

	private String proposalUuid;

	private Long researcherProfilePersonalInfoMasterId;
	
	private Long stProfileOfExpertEvaluatorsIdForProMarks;
	
	private Long stProfileOfExpertEvaluatorsIdForResearch;

	private Long stFiscalYearId;

	private Long stResearchCatTypeId;

	private Long stSectorTypeId;

	private Long stSubSectorsId;

	private String researchTitle;

//	private Long stSdgsGoalsId;
//
//	private Long isCancelled;
//
//	private String cancellationNote;
//
//	private Long cancelledBy;
//
//	private Long isEditable;
//
//	private Long resProfilePersonalInfoId;
	/* proposal end */

	private Long profileId;

	private String profileUuid;

//	private Long rmsUserSignatureId;
//
//	private Long rmsUserImageId;
//
//	private String regNumber;

	private Long userId;

//	private Date dateOfBirth;
//
//	private Long age;
//
//	private String fatherName;
//
//	private String motherName;
//
//	private String emailAddress;
//
//	private String mobileNo;
//
//	private String researchTraining;
//
//	private String nIDNumber;
//
//	private String nIDVerificationStatus;
//
//	private String tINNumber;
//
//	private String tINVerificationStatus;
//
//	private String occupation;
//
//	private String designation;
//
//	private String totalResearcherNumbers;

//	private String divisionId;

//	private String districtId;
//
//	private String upzilaId;
//
//	private String unionId;

//	private String anotherDetails;

//	private String detailsPresentAddress;

//	private Boolean isPending;
//
//	private Boolean isDraftApproval;
//
//	private Boolean isFinalApproval;

//	private String presentAddress;
//	private String permanentAddress;
//	private String fullName;

	private Boolean isDeleted;
	private Integer approvalStatus;
	private Integer approvedBy;
	
	private Double profileMarks;
	private Double proposalMarks;
	private Long stProfileOfExpertEvaluatorsId;	
	private Boolean isInstitutional;
	private Boolean isFinalSubmit;
	

	@Transient
	private UserResponse userDto;

	@Transient
	private PageableRequestBodyDTO pageableRequestBodyDTO;

	@Transient
	private String orderBy;

	/*Added By Rakib For Report*/

	@Transient
	private String field;

	@Transient
	private String stResearchCatType;

	@Transient
	private String subField;

	@Transient
	private String stFiscalYear;

	/**/



}
