package com.ibcs.idsdp.projectconcept.web.dto.response;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;
import java.util.List;

@Data
public class TappObjectiveCost extends BaseEntity {

    private String projectTitleEn;

    private String projectTitleBn;

    private String ministryDivision;

    private String implementingAgency;

    private String objectivesTargets;

    private String designationContactPerson;

    private String responsiblePreparation;

    private String developmentPartner;

    private Long concernedDivisionId;

    private String developmentPartnerId;

    private LocalDate dateCommencement;

    private LocalDate dateCompletion;

    private LocalDate cumulativeDate;

    private Long projectConceptMasterId;

    private Long tappMasterId;

    private String projectConceptUuid;

    private String revisedVersion;

    private Boolean timeExtension;

    private Boolean costExtension;

    private Boolean status;

    private Long referenceId;

    private String referenceUuid;

    private String mainFeaturesOfRevision;

    private String ppsCode;

    private Boolean isEcnecAcknowledgement;

    private String ecnecId;
}
