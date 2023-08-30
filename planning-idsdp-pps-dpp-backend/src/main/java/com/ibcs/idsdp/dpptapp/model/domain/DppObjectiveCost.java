package com.ibcs.idsdp.dpptapp.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "dpp_master")
@EntityListeners(AuditingEntityListener.class)
public class DppObjectiveCost extends BaseEntity {

    @Column(name="project_title_en")
    private String projectTitleEn;

    @Column(name="project_title_bn")
    private String projectTitleBn;

    @Column(name="ministry_division")
    private String ministryDivision;

    @Column(name="implementing_agency")
    private String implementingAgency;

    @Column(name="objectives_targets", columnDefinition = "TEXT")
    private String objectivesTargets;

    @Column(name="concerned_division_id")
    private Long concernedDivisionId;

    @Column(name="project_concept_uuid")
    private String projectConceptUuid;

    @Column(name="project_concept_master_id", unique = true)
    private Long projectConceptMasterId;

    @Column(name="paripatra_version_id")
    private Long paripatraVersionId;

    @Column(name="date_commencement")
    private LocalDate dateCommencement;

    @Column(name="date_completion")
    private LocalDate dateCompletion;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private List<DppModeOfFinancing> modeFinanceList;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private List<DppCurrencyRate> currencyRateList;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "dpp_master_id")
    private List<DppDevelopmentPartners> developmentPartnersList;

    @Column(name="status")
    private Boolean status;

    @Column(name="fs_uuid")
    private String fsUuid;

    @Column(name="fs_attachment_id")
    private Long fsAttachmentId;

    @Column(name="pps_Code", unique = true)
    private String ppsCode;

    @Column(name="ams_Code", unique = true)
    private String amsCode;

    @Column(name="finance_code", unique = true)
    private String financeCode;

    @Transient
    private Long referenceId;

    @Transient
    private String referenceUuid;
}
