package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "dpp_project_management_setup_master")
@EntityListeners(AuditingEntityListener.class)
public class DppProjectManagementSetupMaster extends BaseEntity {
    private String projectConceptUuid;
    private Long projectConceptId;
    private Long attachmentId;
}
