package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.SectorTypeResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;

import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Table(name = "m1_researcher_proposal")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposal extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "researcher_profile_personal_info_master_id")
	private ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster;

	@NotNull
	private Long stFiscalYearId;

	@NotNull
	private Long stResearchCatTypeId;

	@NotNull
	private Long stSectorTypeId;
	
	private Long stSubSectorsId;

	@NotNull
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

	@Column(name = "division_id", columnDefinition = "Text")
	private String divisionId;

	@Column(name = "district_id", columnDefinition = "Text")
	private String districtId;

	@Column(name = "upzila_id", columnDefinition = "Text")
	private String upzilaId;

	@Column(name = "division_name", columnDefinition = "Text")
	private String divisionName;

	@Column(name = "district_name", columnDefinition = "Text")
	private String districtName;

	@Column(name = "upzila_name", columnDefinition = "Text")
	private String upzilaName;
	
	@Column(name = "proposal_topic")
	private String proposalTopic;
	
	@Transient
	private UserResponse userDto;

	@Transient
	private String stFiscalYear;	
	
	@Transient
	private ResearchCategoryTypeResponseDto categoryType;	
	
	@Transient
	private SectorTypeResponseDto fieldName;

	@Transient
	private String proposalUuid;

}
