package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m1_researcher_proposal_rsc_working_in_org")
@Entity
@Data
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposalRscWorkingInOrg extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;
	
	private String researcherName;
	private String designation;
	private Integer age;
	private String occupation;
	private Boolean isMainResearcher;
	private String mobileNo;
	private String emailAddress;
	private String nidNo;
	private String telephoneNo;
	private String educationQualification;
	private String researcherTypeName;
	
	
	
}
