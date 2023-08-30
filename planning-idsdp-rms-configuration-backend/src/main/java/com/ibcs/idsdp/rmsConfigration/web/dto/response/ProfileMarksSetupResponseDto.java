package com.ibcs.idsdp.rmsConfigration.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class ProfileMarksSetupResponseDto extends UuidIdHolderRequestBodyDTO {

	private String researchCategory;

	private Integer govEmployee;

	private Integer applicantAge;

	private Integer marksOnProfession;

	private Integer marksOnSubjectRelevancy;

	private Integer firstDivision;

	private Integer secDivision;

	private Integer thirdDivision;

	private Integer postGraduateResultMarksFirst;

	private Integer postGraduateResultMarksSec;

	private Integer postGraduateResultMarksThird;

	private Integer mphil;

	private Integer phd;

	private Integer organizationStructure;

	private Integer organizationActivity;

	private Integer thesisGroup;

	private Integer nonThesis;

	private Integer marksIfPublishedInJournal;

	private Integer marksIfTrainedOnResearch;

	private Integer publishedJournalQtyLocal;

	private Integer publishedJournalQtyIntl;

	private Integer experienceYearsInResearchWork;

	private Integer researchExperience1;
	private Integer researchExperience2;
	private Integer researchExperience3;

	// new
	private Integer graduateCgps4;
	private Integer graduateCgps35To39;
	private Integer graduateCgpsBelow35;

	private Integer postGraduateCgps4;
	private Integer postGraduateCgps35To39;
	private Integer postGraduateCgpsBelow35;

	private Integer journalPublicationLocOneToFive;
	private Integer journalPublicationLocSixToTen;
	private Integer journalPublicationLocTenPlus;

	private Integer journalPublicationIntOneToFive;
	private Integer journalPublicationIntSixToTen;
	private Integer journalPublicationIntTenPlus;

	private Integer researchExperienceOneToSeven;
	private Integer researchExperienceEight;
	private Integer researchExperienceEightPlus;

	//===== newly added ============
	private Integer instPostGraduate1;
	private Integer instPostGraduate2;

	private Integer instMPhil1;
	private Integer instMPhil2;

	private Integer instPhd1;
	private Integer instPhd2;

	private Integer localPublication1;
	private Integer localPublication2;
	private Integer localPublication3;

	private Integer interPublication1;
	private Integer interPublication2;
	private Integer interPublication3;

	private Integer graduateCgpaFirst;
	private Integer graduateCgpaSecond;
	private Integer graduateCgpaThird;
	private Integer postGraduateCgpaFirst;
	private Integer postGraduateCgpaSecond;
	private Integer postGraduateCgpaThird;
}
