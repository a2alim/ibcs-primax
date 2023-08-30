package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import com.ibcs.idsdp.trainninginstitute.enums.InstituteType;
import com.ibcs.idsdp.trainninginstitute.enums.ProposalStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import lombok.Data;

import javax.persistence.*;
import java.time.LocalDate;

/**
 * @author by <a href="mailto:eproni29@gmail.com">moniruzzaman</a>
 * @since on 3/4/22
 */
@Data
public class ProposalResponse {

    private Long id;
    private String uuid;
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
    private Boolean isEditable;
    private Boolean isSubmitted;
    private TrainingInstituteProfileModel trainingInstituteProfileModel;
    private ProposalStatus proposalStatus;
    private Boolean isShortListed;
    private Long courseScheduleId;
}
