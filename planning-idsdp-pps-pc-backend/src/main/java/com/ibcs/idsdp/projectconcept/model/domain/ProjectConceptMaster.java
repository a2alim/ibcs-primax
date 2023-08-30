package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectTypeDTO;
import lombok.Data;
import org.hibernate.annotations.CreationTimestamp;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.Date;

@Data
@Entity
@Table(name = "project_concept_master")
@EntityListeners(AuditingEntityListener.class)
public class ProjectConceptMaster extends BaseEntity {

    private long paripatraVersionId;


    private String projectCode;

    private Long projectTypeId;

    private Long priorityId;

    @Column(length = 1000)
    private String titleEn;

    @Column(length = 1000)
    private String titleBn;

    @Column(columnDefinition = "TEXT")
    private String objectivesEn;

    @Column(columnDefinition = "TEXT")
    private String objectivesBn;

    private LocalDate expCommencementDate;

    private LocalDate expCompletionDate;

    private Double totalAmount;

    private Double gobAmount;

    private Double feGobAmount;

    private Double ownFundAmount;

    private Double feOwnFundAmount;

    private Double paAmount;

    private Double rpaAmount;

    private Double dpaAmount;

    private Double otherAmount;

    private Double feOtherAmount;

    private Long sectorDivisionId;

    private Long sectorId;

    private Long subSectorId;

    private Long mainCofogId;

    private Long optionalCofogId;

    private Long detailsCofogId;

    private Boolean isSelfFund;

    private Boolean isForeignAid;

    @Column(length = 128)
    private String agreementNo;

    private Long agreementAttachmentId;

    private Long agencyId;

    @Column(name = "sponsoring_ministry_name")
    private String sponsoringMinistryName;

    @Column(name = "implementing_agency_name")
    private String implementingAgencyName;

    private String sourceModuleType;

    private Long pcLinkId;

    @Column(name="pps_Code", unique = true)
    private String ppsCode;

    @Column(name="ams_Id", unique = true)
    private Long amsId;

    @Column(name="ams_Code")
    private String amsCode;

    @Column(name="finance_code", unique = true)
    private String financeCode;

    @Column(name="is_ecnec_acknowledgement", columnDefinition = "bool default false")
    private Boolean isEcnecAcknowledgement;

    @Column(name = "movement_date", columnDefinition="timestamp without time zone")
    @CreationTimestamp
    private Date movementDate;

    private String ecnecId;

    private String epimsCode;

    private String spimsCode;

    private String plisPdfUrl;

    private Date plisPdfCreatedDate;

    @Transient
    private ProjectTypeDTO projectTypeDTO;
}
