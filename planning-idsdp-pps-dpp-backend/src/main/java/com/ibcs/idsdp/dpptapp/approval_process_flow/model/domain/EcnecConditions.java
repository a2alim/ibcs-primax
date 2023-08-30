package com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Data
@Entity
public class EcnecConditions extends BaseEntity {

    @OneToOne
    private ProjectMovementStage projectMovementStage;

    @OneToOne
    private Attachment attachment;

    @Column(columnDefinition = "TEXT")
    private String conditions;
}
