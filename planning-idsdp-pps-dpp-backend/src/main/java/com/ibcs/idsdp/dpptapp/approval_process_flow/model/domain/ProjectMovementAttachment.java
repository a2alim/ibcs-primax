package com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.OneToOne;

@Data
@Entity
public class ProjectMovementAttachment extends BaseEntity {

    @OneToOne
    private ProjectMovementStage projectMovementStage;

    @OneToOne
    private Attachment attachment;

    private String paperType;
}
