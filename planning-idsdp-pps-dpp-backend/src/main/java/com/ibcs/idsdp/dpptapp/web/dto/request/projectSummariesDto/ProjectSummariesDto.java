package com.ibcs.idsdp.dpptapp.web.dto.request.projectSummariesDto;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;
import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Data
public class ProjectSummariesDto extends UuidIdHolderRequestBodyDTO {

    private Boolean isDeleted;
    private String createdBy;
    private LocalDate createdOn;
    private String projectUuid;
    private String descriptionAndLogicality;
    private String mainActivities;
    private String projectConsistency;
    private String locationLogicality;
    private String locationAndAllocation;
    private String projectLocationAndAllocationADB;
    private String pictureOfRealWork;
    private String analysisOfIncome;
    private String pecMeetingDate;

    private String specRecomendationMeeting;
    private String projectObjectives;
    private String decesionPecMeeting;
    private Date dateOfReceptDpp;
    private String projectApprovalTerms;
    private Date summariesCreateDate;

    private String ongoingAnnualProgramsAllocations;
    private String proposedCoreActivities;
    private String projectReasonOfCorrections;
    private String recommendationOfPecMeeting;
    private String othersInformation;
    private String opinionsAndRecommendations;

    private String feasibilityStudy;
    private String summariesType;

    private List<YearWiseCostDto> yearWiseCostList;
}
