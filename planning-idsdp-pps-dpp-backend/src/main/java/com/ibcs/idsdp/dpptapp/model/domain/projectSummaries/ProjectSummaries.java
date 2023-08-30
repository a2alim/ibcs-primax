package com.ibcs.idsdp.dpptapp.model.domain.projectSummaries;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Data
@Entity
@Table(name = "project_summaries")
@EntityListeners(AuditingEntityListener.class)
public class ProjectSummaries extends BaseEntity {

    private String projectUuid;
    @Column(columnDefinition = "TEXT")
    private String descriptionAndLogicality;
    @Column(columnDefinition = "TEXT")
    private String mainActivities;
    @Column(columnDefinition = "TEXT")
    private String projectConsistency;
    @Column(columnDefinition = "TEXT")
    private String locationLogicality;
    @Column(columnDefinition = "TEXT")
    private String locationAndAllocation;

    @Column(columnDefinition = "TEXT")
//    projectLocationAndAllocationADB
    private String projectLocationAndAllocationADB;
    @Column(columnDefinition = "TEXT")
    private String pictureOfRealWork;
    @Column(columnDefinition = "TEXT")
    private String analysisOfIncome;
    @Column(columnDefinition = "TEXT")
    private String pecMeetingDate;
    @Column(columnDefinition = "TEXT")

    private String ongoingAnnualProgramsAllocations;
    @Column(columnDefinition = "TEXT")
    private String proposedCoreActivities;
    @Column(columnDefinition = "TEXT")
    private String projectReasonOfCorrections;
    @Column(columnDefinition = "TEXT")
    private String recommendationOfPecMeeting;

    @Column(columnDefinition = "TEXT")
    private String othersInformation;
    @Column(columnDefinition = "TEXT")
    private String opinionsAndRecommendations;

    @Column(columnDefinition = "TEXT")
    private String specRecomendationMeeting;
    @Column(columnDefinition = "TEXT")
    private String projectObjectives;
    @Column(columnDefinition = "TEXT")
    private String decesionPecMeeting;
    private Date dateOfReceptDpp;
    @Column(columnDefinition = "TEXT")
    private String projectApprovalTerms;
    private Date summariesCreateDate;
    @Column(columnDefinition = "TEXT")
    private String feasibilityStudy;

    private String summariesType;

    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "project_summaries_id")
    private List<YearWiseCost> yearWiseCostList;
}
