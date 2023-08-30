package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "justification_type")
@EntityListeners(AuditingEntityListener.class)
public class JustificationType extends BaseEntity {

    private String code;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;

}