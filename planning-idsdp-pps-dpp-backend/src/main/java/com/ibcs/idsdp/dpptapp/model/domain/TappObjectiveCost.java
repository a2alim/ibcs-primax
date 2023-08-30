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
@Table(name = "tapp_objective_cost")
@EntityListeners(AuditingEntityListener.class)
public class TappObjectiveCost extends BaseEntity {

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

    @Column(name="designation_contact_person", columnDefinition = "TEXT")
    private String designationContactPerson;

    @Column(name="responsible_preparation", columnDefinition = "TEXT")
    private String responsiblePreparation;

    @Column(name="development_partner", columnDefinition = "TEXT")
    private String developmentPartner;

    @Column(name="concerned_division_id")
    private Long concernedDivisionId;

    @Column(name="development_partner_id")
    private String developmentPartnerId;

    @Column(name="date_commencement")
    private LocalDate dateCommencement;

    @Column(name="date_completion")
    private LocalDate dateCompletion;

    @Column(name = "project_concept_master_id")
    private Long projectConceptMasterId;

    @Column(name="project_concept_uuid")
    private String projectConceptUuid;

    @Column(name="status")
    private Boolean status;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "tapp_master_id")
    private List<TappCurrencyRate> currencyRateList;

    @JsonIgnore
    @OneToMany(fetch = FetchType.LAZY, cascade = CascadeType.ALL)
    @JoinColumn(name = "tpp_master_id")
    private List<TppModeOfFinancing> modeFinanceList;

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
