package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "dpp_psc_working_plan")
public class PscWorkingPlan extends BaseEntity {

    private String projectConceptUuid;
    private Long projectConceptMasterId;

    private String userType;

    private String pscPaperType;

    @Column(columnDefinition = "TEXT")
    private String sanctionSchedule;

    @Column(columnDefinition = "TEXT")
    private String projectPurpose;

    @Column(columnDefinition = "TEXT")
    private String mainActivity;

    @Column(columnDefinition = "TEXT")
    private String partWiseExpense;

    @Column(columnDefinition = "TEXT")
    private String projectReason;

    @Column(columnDefinition = "TEXT")
    private String analysisBackground;

    @Column(columnDefinition = "TEXT")
    private String consistencyAnalysis;

    @Column(columnDefinition = "TEXT")
    private String projectPrinciple;

    @Column(columnDefinition = "TEXT")
    private String analysisType;

    @Column(columnDefinition = "TEXT")
    private String rationalityAnalysis;

    @Column(columnDefinition = "TEXT")
    private String relatedOtherSubjects;
}
