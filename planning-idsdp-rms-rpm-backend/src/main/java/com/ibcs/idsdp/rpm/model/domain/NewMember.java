package com.ibcs.idsdp.rpm.model.domain;

import javax.persistence.Entity;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

import com.ibcs.idsdp.common.model.domain.BaseEntity;

import lombok.Data;

@Table(name = "m2_add_new_member")
@Entity
@Data
public class NewMember extends BaseEntity{
	
	@ManyToOne
	@JoinColumn(name="m2_researcher_presentation_id")
	private ResearcherPresentation researcherPresentation;
	
	@NotNull
	private String  evaluatorName;	
	
	@NotNull
	private String profileSummary;
	
	@NotNull
	private Long stCommonTypeId;
	
	private Long isEditable;

}
