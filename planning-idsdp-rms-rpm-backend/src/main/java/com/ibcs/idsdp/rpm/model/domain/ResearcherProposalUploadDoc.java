package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.validator.constraints.Length;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m1_researcher_proposal_upload_doc")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposalUploadDoc extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	private Long stDocumentTypeId;

	@NotNull
	private String docName;


	@Column(columnDefinition = "TEXT")
	private String briefOnDocument;


	@Column(length = 5000)
	private String fileDownloadUrl;

	@Column(length = 5000)
	private String bucketName;

	@Column(length = 5000)
	private String fileName;

	private Integer isEditable;

}
