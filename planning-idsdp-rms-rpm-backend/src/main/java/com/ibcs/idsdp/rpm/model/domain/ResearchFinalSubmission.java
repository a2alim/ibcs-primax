package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "m2_research_final_submission")
public class ResearchFinalSubmission extends BaseEntity {

	@Column(name = "m1_researcher_profile_personal_info_id", nullable = false)
	private Long m1ResearcherProfilePersonalInfoId;

	@Column(name = "m1_researcher_proposal_id", nullable = false)
	private Long m1ResearcherProposalId;

	@Column(name = "submission_date", nullable = false)
	private Date submissionDate;

	@Column(name = "object_summary", columnDefinition = "text", nullable = false)
	private String objectSummary;

	@Column(name = "introduction", columnDefinition = "Text", nullable = false)
	private String introduction;

	@Column(name = "background", columnDefinition = "Text", nullable = false)
	private String background;

	@Column(name = "method_followed_in_the_research", columnDefinition = "Text", nullable = false)
	private String methodFollowedInTheResearch;

	@Column(name = "findings", columnDefinition = "Text")
	private String findings;

	@Column(name = "discussion", columnDefinition = "Text")
	private String discussion;

	@Column(name = "policy", columnDefinition = "Text")
	private String policy;

	@Column(name = "general_recommendation", columnDefinition = "Text")
	private String generalRecommendation;

	@Column(name = "hash_tag", columnDefinition = "Text")
	private String hashTag;

	@Column(name = "hash_tag_bn", columnDefinition = "Text")
	private String hashTagBn;

	@Column(name = "conclusion", columnDefinition = "Text", nullable = false)
	private String conclusion;

	@Column(name = "status")
	private String status;

	private Boolean isFinalSubmit;

}
