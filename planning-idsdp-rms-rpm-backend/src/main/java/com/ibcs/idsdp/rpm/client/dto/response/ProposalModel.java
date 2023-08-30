package com.ibcs.idsdp.rpm.client.dto.response;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import java.time.LocalDate;

@Data
public class ProposalModel extends BaseEntity {

    private String trainingName;

    private String instituteName;


    private String instituteHead;


    private String previousExperience;

    private Integer trainingDuration;

    private Integer courseNo;

    private LocalDate programDate;

    private String typeOfCourse;

    private Integer noOfTrainer;

    private Integer noOfTrainee;


    private String principalAndStrategies;


    private String courseObjective;

    private String trainingMethods;


    private String infrastructuralFacility;


    private String anyCourseFeeFromTrainee;


    private String otherRelevantInfo;

    private Long fiscalYearId;

    private Boolean isEditable;

    private Boolean isSubmitted;

  //  private ProposalStatus proposalStatus;
    
    private String proposalStatus;

    private Boolean isShortListed;

}
