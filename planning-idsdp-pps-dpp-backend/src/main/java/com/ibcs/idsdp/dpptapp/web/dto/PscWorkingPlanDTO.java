package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class PscWorkingPlanDTO extends UuidIdHolderRequestBodyDTO {
    private String projectConceptUuid;
    private String projectTitleBn;
    private Long projectConceptMasterId;
    private String userType;
    private String pscPaperType;
    private String sanctionSchedule;
    private String projectPurpose;
    private String mainActivity;
    private String partWiseExpense;
    private String projectReason;
    private String analysisBackground;
    private String consistencyAnalysis;
    private String projectPrinciple;
    private String analysisType;
    private String rationalityAnalysis;
    private String relatedOtherSubjects;
    private Double totalAmount;
    private Double gobAmount;
    private Double paAmount;
    private Double ownFundAmount;
    private Double otherAmount;
    private String ministryDivision;
    private String implementingAgency;
    private String duration;
    public List<DppModeFinancingDTO> modeFinanceList;
}
