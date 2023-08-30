package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.rpm.enums.LetterType;
import com.ibcs.idsdp.rpm.enums.Status;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "rms_create_letters")
public class Latter extends BaseEntity {

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposalId;

	@Column(nullable = false, length = 255)
	private String subject;

	@Column(nullable = false, columnDefinition = "TEXT")
	private String mailBody;

	private boolean mailStatus;

	private LetterType letterType;

	@Column(nullable = false)
	private Status status;

	@OneToOne(cascade = CascadeType.MERGE)
	@JoinColumn(name = "rms_user_signature_id")
	private UserSignature rmsUserSignatureId;

	private String memorandumNo;

	private String nothiDateEn;

	private String nothiDateBn;

//	@NotNull
//	@Column(name = "m1_proposal_created_by", nullable = false, length = 200)
//	private String proposalCreatedBy;
//
}
