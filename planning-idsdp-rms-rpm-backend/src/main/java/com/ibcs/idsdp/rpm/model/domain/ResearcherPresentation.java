package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;

import lombok.Data;

@Data
@Entity
@Table(name = "m2_researcher_presentation")
public class ResearcherPresentation extends BaseEntity {
	
	@NotNull
	@OneToOne
	@JoinColumn(name = "m2_create_seminar_id")
	private CreateSeminar createSeminar;
	
	@NotNull
	@OneToOne
	@JoinColumn(name = "m1_researcher_proposal_id")
    private ResearcherProposal researcherProposal;
	
	@NotNull
	private Long presentationStatus;

	@NotNull
	private Long presentationType;
	
	private Boolean isEditable;

}
