package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "project_movement")
@EntityListeners(AuditingEntityListener.class)
public class ProjectMovement extends BaseEntity {

    private Long orderId;
    private String code;
    private String statusButtonPosition;
    private Boolean editable;
    private String movementTitleEn;
    private String movementTitleBn;
    private String description;
    private Long moduleId;
    private Long userGroupId;
    private Boolean status;
}
