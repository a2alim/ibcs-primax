package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.NonNull;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "m2_final_evaluation_report_of_research")
//@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class FinalEvaluationReport extends BaseEntity {

	@NonNull
	private Long m1ResearcherProposalInfoId;

	@Column(name = "research_objectives", columnDefinition = "Text")
	private String researchObjectives;

	@Column(name = "describe_problem", columnDefinition = "Text")
	private String describeProblem;

	@Column(name = "note", columnDefinition = "Text")
	private String note;

	private Boolean isResearchRulesAreFollowed;

	private Boolean isEditable;

	private Boolean isActive;

}
