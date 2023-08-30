package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;
import org.hibernate.annotations.LazyCollection;
import org.hibernate.annotations.LazyCollectionOption;

import javax.persistence.*;
import java.util.List;


@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_COURSE")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class CourseModel extends BaseEntity {

//    private String courseTitle;

    @OneToOne(cascade = {CascadeType.PERSIST,CascadeType.REMOVE}, fetch = FetchType.EAGER, targetEntity = ProposalModel.class)
    @JoinColumn(name = "M3_PROPOSAL_ID")
    private ProposalModel proposalModel;

    private int totalHours;

    private String programDuration;

    private String comment;

    private Long fiscalYearId;

    @LazyCollection(LazyCollectionOption.FALSE)
    @OneToMany(targetEntity = CourseScheduleModel.class,cascade = CascadeType.ALL)
    @JoinColumn(name = "M3_COURSE_ID")
    private List<CourseScheduleModel> courseScheduleModels;

    private boolean isSubmitted;

    @OneToOne(fetch = FetchType.EAGER, cascade = CascadeType.DETACH)
    @JoinColumn(name = "M3_TRAINING_INSTITUTE_PROFILE_ID")
    private TrainingInstituteProfileModel m3TrainingInstituteProfileId;

    private boolean isEditable;

}
