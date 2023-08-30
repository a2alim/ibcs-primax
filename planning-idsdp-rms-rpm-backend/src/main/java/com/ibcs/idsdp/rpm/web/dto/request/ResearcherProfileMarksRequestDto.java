package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.validation.constraints.NotNull;

@Data
public class ResearcherProfileMarksRequestDto extends UuidIdHolderRequestBodyDTO{

	@NotNull
	private Long researcherProposalId;

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
