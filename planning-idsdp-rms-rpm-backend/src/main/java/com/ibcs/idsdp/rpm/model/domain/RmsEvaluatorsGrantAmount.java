package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Table(name = "rms_evaluators_grant_amount")
@Entity
@Data
public class RmsEvaluatorsGrantAmount extends BaseEntity {

	@NotNull
	@ManyToOne
	@JoinColumn(name = "rms_evaluators_grant_amount_letter_id")
	private RmsEvaluatorsGrantAmountLetter rmsEvaluatorsGrantAmountLetter;

	@NotNull
	@OneToOne
	@JoinColumn(name = "researcher_proposal_id")
	private ResearcherProposal researcherProposal;

	@NotNull
	private Long stProfileOfExpertEvaluatorsId;

	@NotNull
	private Double grantAmount;

}
