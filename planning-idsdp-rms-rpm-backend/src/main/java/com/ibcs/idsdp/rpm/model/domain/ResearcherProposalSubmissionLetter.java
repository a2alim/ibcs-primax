package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Table(name = "m1_researcher_proposal_submission_letter")
@Entity
@Data
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ResearcherProposalSubmissionLetter extends BaseEntity {

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	private String subject;

	@NotNull
	@Column(columnDefinition = "TEXT")
	private String letterBody;

	@NotNull
	private Integer mailSend;

}
