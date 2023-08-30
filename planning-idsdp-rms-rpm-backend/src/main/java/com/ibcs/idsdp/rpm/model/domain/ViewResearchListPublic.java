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
public class ViewResearchListPublic {

	/* proposal start */

	@Id
	private Long id;
	private String keyWord;
	private String hashTag;
	private Long proposalId;
	private String proposalUuid;
	private Long researcherProfilePersonalInfoMasterId;
	private Long stProfileOfExpertEvaluatorsIdForProMarks;
	private Long stFiscalYearId;
	private Long stResearchCatTypeId;
	private Long stSectorTypeId;
	private Long stSubSectorsId;
	private String researchTitle;
	private Long profileId;
	private String profileUuid;
	private Boolean isDeleted;
	private Integer approvalStatus;
	private Integer approvedBy;
	private Boolean isInstitutional;
	private Boolean isFinalSubmit;
	private Long userId;

	private Long divisionId;
	private String divisionName;
	private Long districtId;
	private String districtName;
	private Long upzilaId;
	private String upzilaName;

	@Transient
	private UserResponse userDto;

	@Transient
	private PageableRequestBodyDTO pageableRequestBodyDTO;

	@Transient
	private String orderBy;

	@Transient
	private String field;

	@Transient
	private String stResearchCatType;

	@Transient
	private String subField;

	@Transient
	private String stFiscalYear;

}
