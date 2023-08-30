package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m1_researcher_proposal_institute_info")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposalInstituteInfo extends BaseEntity {

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	private String instituteName;

	@NotNull
	private String addressDetails;

	@NotNull
	private Integer yearOfEstablishment;

	private String registrationNo;

	@NotNull
	private String telephoneNo;

	@NotNull
	private String emailAddress;

	private String tinNo;

	private String taxTokenImgOfCurrentYear;

	// for file upload
	@Column(length = 5000)
	private String fileDownloadUrl;

	@Column(length = 5000)
	private String bucketName;

	@Column(length = 5000)
	private String fileName;
	// for file upload

	private Integer isEditable;

}
