export class ResearcherProfileMarks {

    id: number;
    uuid: string;
    researcherProposalId: number;
    stResearchCatTypeId: number;
    applicantAgeGovtEmployeeMarks: number;
    professionMarks: number;
    subjectRelevancyMarks: number;
    educationQualificationMarks: number;
    graduationType: string;
    graduationMarks: number;
    postGraduationType: string;
    postGraduationMarks: number;
    mphilPhdMarks: number;
    mphilMarks: number;
    phdMarks: number;
    thesisGroupMarks: number;
    nonThesisGroupMarks: number;
    nonThesisMarks: number;
    thesisMarks: number;
    publicationMarks: number;
    localPublicationMarks: number;
    internalPublicationMarks: number;
    researchWorkMarks: number;
    researchTrainingMarks: number;
    // thesisOnPostGraduationMarks: number;
    graduationRelatedToSociologyMarks: number;
    institutionalTypeInvolvementMarks: number = 0;
    institutionalFunctionalInvolvementMarks: number = 0;

    realAgeGovtEmployee: string;
    realProfession: string;
    realSubjectRelevancy: string;
    realEducationQualification: string;
    realGraduation: string;
    realPostGraduation: string;
    realMphilPhd: string;
    realMphil: string;
    realPhd: string;
    realThesisGroup: string;
    realThesis: string;
    realNonThesis: string;
    realNonThesisGroup: string;
    realPublication: string;
    realLocalPublication: string;
    realInternalPublication: string;
    realResearchWork: any;
    realResearchTraining: string;
    // realThesisOnPostGraduation: string;
    realGraduationRelatedToSociology: string;
    realInstitutionalTypeInvolvement: string;
    realInstitutionalFunctionalInvolvement: string;

    totalMarks: number;
    researcherProfilePersonalInfoDto: any;

    isGovEmployee: any;

}
