package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_profile_marks_setup")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProfileMarksSetup extends BaseEntity {

    @Column(name = "st_fiscal_year_id", nullable = true)
    private Integer stFiscalYearId;

    @Column(name = "st_research_cat_type_id", nullable = true)
    private Long stResearchCatTypeId;

    @Column(name = "research_category", nullable = true)
    private String researchCategory;

    @Column(name = "applicant_age", nullable = true)
    private Integer applicantAge;
    
    @Column(name = "gov_employee", nullable = true)
    private Integer govEmployee;

    @Column(name = "marks_on_profession", nullable = true)
    private Integer marksOnProfession;

    @Column(name = "marks_on_subject_relevancy", nullable = true)
    private Integer marksOnSubjectRelevancy;


    @Column(name = "first_division", nullable = true)
    private Integer firstDivision;

    @Column(name = "sec_division", nullable = true)
    private Integer secDivision;

    @Column(name = "third_division", nullable = true)
    private Integer thirdDivision;
    
    @Column(name = "graduate_cgps_4", nullable = true)
    private Integer graduateCgps4;
    
    @Column(name = "graduateCgps_35_to_39", nullable = true)
    private Integer graduateCgps35To39;
    
    @Column(name = "graduate_cgps_below_35", nullable = true)
    private Integer graduateCgpsBelow35;
   

    @Column(name = "post_graduate_result_marks_first", nullable = true)
    private Integer postGraduateResultMarksFirst;

    @Column(name = "post_graduate_result_marks_sec", nullable = true)
    private Integer postGraduateResultMarksSec;

    @Column(name = "post_graduate_result_marks_third", nullable = true)
    private Integer postGraduateResultMarksThird;

    @Column(name = "post_graduate_cgps_4", nullable = true)
    private Integer postGraduateCgps4;
    
    @Column(name = "post_graduate_cgps_35_to_39", nullable = true)
    private Integer postGraduateCgps35To39;
    
    @Column(name = "post_graduate_cgps_below_35", nullable = true)
    private Integer postGraduateCgpsBelow35;

    @Column(name = "organization_structure", nullable = true)
    private Integer organizationStructure;

    @Column(name = "organization_activity", nullable = true)
    private Integer organizationActivity;

    @Column(name = "thesis_group", nullable = true)
    private Integer thesisGroup;

    @Column(name = "non_thesis", nullable = true)
    private Integer nonThesis;
    
    @Column(name = "mphil", nullable = true)
    private Integer mphil;

    @Column(name = "phd", nullable = true)
    private Integer phd;

    @Column(name = "marks_if_published_in_journal", nullable = true)
    private Integer marksIfPublishedInJournal;

    @Column(name = "marks_if_trained_on_research", nullable = true)
    private Integer marksIfTrainedOnResearch;

    @Column(name = "published_journal_qty_local", nullable = true)
    private Integer publishedJournalQtyLocal;

    @Column(name = "published_journal_qty_intl", nullable = true)
    private Integer publishedJournalQtyIntl;

    @Column(name = "experience_years_in_research_work", nullable = true)
    private Integer experienceYearsInResearchWork;

    @Column(name = "research_experience_1", nullable = true)
    private Integer researchExperience1;

    @Column(name = "research_experience_2", nullable = true)
    private Integer researchExperience2;

    @Column(name = "research_experience_3", nullable = true)
    private Integer researchExperience3;

    @Column(name = "journal_publication_loc_one_to_five", nullable = true)
    private Integer journalPublicationLocOneToFive;
    
    @Column(name = "journal_publication_loc_six_to_ten", nullable = true)
    private Integer journalPublicationLocSixToTen;
    
    @Column(name = "journal_publication_loc_ten_plus", nullable = true)
    private Integer journalPublicationLocTenPlus;

    @Column(name = "journal_publication_int_one_to_five", nullable = true)
    private Integer journalPublicationIntOneToFive;
    
    @Column(name = "journal_publication_int_six_to_ten", nullable = true)
    private Integer journalPublicationIntSixToTen;
    
    @Column(name = "journal_publication_int_ten_plus", nullable = true)
    private Integer journalPublicationIntTenPlus;

    @Column(name = "research_experience_one_to_seven", nullable = true)
    private Integer researchExperienceOneToSeven;
    
    @Column(name = "research_experience_eight", nullable = true)
    private Integer researchExperienceEight;
    
    @Column(name = "research_experience_8plus", nullable = true)
    private Integer researchExperienceEightPlus;

    //========== for institutional =================
    @Column(name = "inst_post_graduate_1", nullable = true)
    private Integer instPostGraduate1;

    @Column(name = "inst_post_graduate_2", nullable = true)
    private Integer instPostGraduate2;

    @Column(name = "inst_mphil_1", nullable = true)
    private Integer instMPhil1;

    @Column(name = "inst_mphil_2", nullable = true)
    private Integer instMPhil2;

    @Column(name = "inst_phd_1", nullable = true)
    private Integer instPhd1;

    @Column(name = "inst_phd_2", nullable = true)
    private Integer instPhd2;

    //========== for institutional & Fellowship=================
    @Column(name = "local_publication_1", nullable = true)
    private Integer localPublication1;

    @Column(name = "local_publication_2", nullable = true)
    private Integer localPublication2;

    @Column(name = "local_publication_3", nullable = true)
    private Integer localPublication3;

    @Column(name = "inter_publication_1", nullable = true)
    private Integer interPublication1;

    @Column(name = "inter_publication_2", nullable = true)
    private Integer interPublication2;

    @Column(name = "inter_publication_3", nullable = true)
    private Integer interPublication3;

    private Integer graduateCgpaFirst;
    private Integer graduateCgpaSecond;
    private Integer graduateCgpaThird;
    private Integer postGraduateCgpaFirst;
    private Integer postGraduateCgpaSecond;
    private Integer postGraduateCgpaThird;
}




