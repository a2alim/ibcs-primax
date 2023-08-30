package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "pc_linkage_target")
@EntityListeners(AuditingEntityListener.class)
public class LinkageAndTarget extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "project_concept_master_id", nullable = false)
    private ProjectConceptMaster projectConceptMaster;

    private String goals;

    private String targets;

    private String indicator;

    private String type;

    private Long attachmentId;

//    private Long pcProjectSummaryId;

}
