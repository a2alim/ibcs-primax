package com.ibcs.idsdp.trainninginstitute.web.dto.response;


import com.ibcs.idsdp.trainninginstitute.enums.InstituteType;
import com.ibcs.idsdp.trainninginstitute.model.domain.CourseScheduleModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.Trainer;

import lombok.*;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ProposalListView {

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
    private String fiscalYear;

    private boolean isSubmitted;


    private List<TrainersListView> trainersListData;
    private List<CourseScheduleListView> courseListData;
    private List<ResearchBudgetListView> researchBudgetListViewList;
    
    private List<Trainer> trainersList;
    private List<CourseScheduleModel> courseScheduleList;
   

}
