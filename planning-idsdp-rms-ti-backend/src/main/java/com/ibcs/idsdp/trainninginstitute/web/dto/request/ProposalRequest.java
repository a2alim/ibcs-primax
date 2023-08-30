package com.ibcs.idsdp.trainninginstitute.web.dto.request;

import java.time.LocalDate;

import com.ibcs.idsdp.common.web.dto.request.IUuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.trainninginstitute.enums.InstituteType;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class ProposalRequest extends UuidIdHolderRequestBodyDTO{

    private String trainingName;

    private String instituteName;

    private InstituteType instituteType;

    private String instituteHead;

    private String previousExperience;

    private Integer trainingDuration;

    private Integer courseNo;

    private LocalDate programDate;   
    
    private LocalDate endDate;

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
    
    private TrainingInstituteProfileModel trainingInstituteProfileModel;


}
