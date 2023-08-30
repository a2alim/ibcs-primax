package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.util.Date;

@Data
@Entity
@Table(name = "feasibility_proposal_master")
@EntityListeners(AuditingEntityListener.class)
public class FspSummary extends BaseEntity {

    private String titleEn;

    private String titleBn;

    private String sponsoringMinistry;

    private String executingAgency;

    private Date dateOfCommencement;

    private Date dateOfCompletion;

    @Column(columnDefinition = "TEXT")
    private String background;

    @Column(columnDefinition = "TEXT")
    private String objective;

    @Column(columnDefinition = "TEXT")
    private String briefOutlineScope;

    @Column(columnDefinition = "TEXT")
    private String output;

    @Column(columnDefinition = "TEXT")
    private String needJustification;

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

    @Column(columnDefinition = "TEXT")
    private String methodologyOfConductingStudy;

    @Column(columnDefinition = "TEXT")
    private String financingArrangement;

    @Column(columnDefinition = "TEXT")
    private String listOfMachinery;

    private String projectConceptMasterUuid;

    private Long projectConceptMasterId;

    private Long paripatraVersionId;

    private Long agencyId;


}
