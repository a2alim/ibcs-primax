package com.ibcs.idsdp.trainninginstitute.model.domain;

import java.time.LocalDate;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EnumType;
import javax.persistence.Enumerated;
import javax.persistence.FetchType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.trainninginstitute.enums.InstituteType;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.ToString;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PROPOSAL")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class ProposalModel extends BaseEntity {

    private String trainingName;

    private String instituteName;

    @Enumerated(EnumType.STRING)
    private InstituteType instituteType;

    private String instituteHead;

    @Column(columnDefinition = "TEXT")
    private String previousExperience;

    private Integer trainingDuration;

    private Integer courseNo;

    private LocalDate programDate;
    
    private LocalDate endDate;

    private String typeOfCourse;

    private Integer noOfTrainer;

    private Integer noOfTrainee;

    @Column(columnDefinition = "TEXT")
    private String principalAndStrategies;

    @Column(columnDefinition = "TEXT")
    private String courseObjective;

    private String trainingMethods;

    @Column(columnDefinition = "TEXT")
    private String infrastructuralFacility;

    @Column(columnDefinition = "TEXT")
    private String anyCourseFeeFromTrainee;

    @Column(columnDefinition = "TEXT")
    private String otherRelevantInfo;

    private Long fiscalYearId;

    private Boolean isEditable;

    private Boolean isSubmitted;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID")
    private TrainingInstituteProfileModel trainingInstituteProfileModel;

    private Integer proposalStatus;

    private Boolean isShortListed;

    private Boolean isCompletionReportSubmitted;

//    @JsonIgnore
//    @OneToOne(fetch = FetchType.EAGER, cascade = {CascadeType.PERSIST,CascadeType.REMOVE}, targetEntity = CourseModel.class)
//    @JoinColumn(name = "M3_COURSE_ID")
//    private CourseModel courseModel;
}
