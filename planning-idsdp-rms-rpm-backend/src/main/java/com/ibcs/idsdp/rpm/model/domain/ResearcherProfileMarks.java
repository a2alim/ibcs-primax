package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Table(name = "m1_researcher_profile_marks")
@Entity
@Data
public class ResearcherProfileMarks extends BaseEntity {

	@ManyToOne
	@JoinColumn(name = "researcher_proposal_id", nullable = false, unique = true)
	private ResearcherProposal researcherProposal;

	@NotNull
	private Long stResearchCatTypeId;

	private Integer applicantAgeGovtEmployeeMarks;

	private Integer professionMarks;

	private Integer subjectRelevancyMarks;

	private Integer educationQualificationMarks;

	private String graduationType;

	private Double graduationMarks;

	private String postGraduationType;

	private Double postGraduationMarks;

	private Integer mphilPhdMarks;

	private Integer mphilMarks;

	private Integer phdMarks;

	private Integer thesisGroupMarks;

	private Integer nonThesisGroupMarks;

	private Integer thesisMarks;

	private Integer nonThesisMarks;

	private Integer publicationMarks;

	private Integer localPublicationMarks;

	private Integer internalPublicationMarks;

	private Integer researchTrainingMarks;

	private Integer researchWorkMarks;

//	private Integer thesisOnPostGraduationMarks;

	private Integer graduationRelatedToSociologyMarks;

	private Integer institutionalTypeInvolvementMarks;

	private Integer institutionalFunctionalInvolvementMarks;


	private String realAgeGovtEmployee;

	private String realProfession;

	private String realSubjectRelevancy;

	private String realEducationQualification;

	private String realGraduation;

	private String realPostGraduation;

	private String realMphilPhd;

	private String realMphil;

	private String realPhd;

	private String realThesisGroup;

	private String realThesis;

	private String realNonThesis;

	private String realNonThesisGroup;

	private String realPublication;

	private String realLocalPublication;

	private String realInternalPublication;

	private String realResearchTraining;

	private String realResearchWork;

//	private String realThesisOnPostGraduation;

	private String realGraduationRelatedToSociology;

	private String realInstitutionalTypeInvolvement;

	private String realInstitutionalFunctionalInvolvement;

	private Integer totalMarks;

}
