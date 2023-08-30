package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Data
@Entity
@Table(name = "rdpp_master")
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

    @Column(name="project_concept_master_id")
    private Long projectConceptMasterId;

    @Column(name="dpp_master_id")
    private Long dppMasterId;

    @Column(name="paripatra_version_id")
    private Long paripatraVersionId;

    @Column(name="date_commencement")
    private LocalDate dateCommencement;

    @Column(name="date_completion")
    private LocalDate dateCompletion;

    @Column(name="date_cumulative")
    private LocalDate cumulativeDate;

    @Column(name="time_extension")
    private Boolean timeExtension;

    @Column(name="cost_extension")
    private Boolean costExtension;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private List<DppModeOfFinancing> modeFinanceList;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private List<DppCurrencyRate> currencyRateList;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "rdpp_master_id")
    private List<DppDevelopmentPartners> developmentPartnersList;

    @Column(name="status")
    private Boolean status;


    @Column(name="fs_uuid")
    private String fsUuid;

    @Column(name = "revised_version")
    private String revisedVersion;

    @Column(name = "revised_version_number")
    private Integer revisedVersionNumber;

    @Column(name="reference_id")
    private Long referenceId;

    @Column(name="reference_uuid")
    private String referenceUuid;

    @Column(name="pps_Code", unique = true)
    private String ppsCode;

    @Column(name="is_ecnec_acknowledgement", columnDefinition = "bool default false")
    private Boolean isEcnecAcknowledgement;

    private String ecnecId;
}
