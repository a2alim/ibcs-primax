package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "CATEGORY_PER_ENVIRONMENT_CONSERVATIONRULES")
@EntityListeners(AuditingEntityListener.class)
public class CategoryPerEnvironmentConservationRules extends BaseEntity {

    @Column(name = "CODE", nullable = false)
    private String code;

    @Column(name = "CATEGORY_CODE")
    private String categoryCode;

    @Column(name = "CATEGORY_CODE_NAME", nullable = false)
    private String categoryCodeName;


    @Column(name = "CATEGORY_CODE_NAME_BNG", nullable = false)
    private String categoryCodeNameBng;

    @Column(name = "DESCRIPTION")
    private String description;

    @Column(name = "STATUS")
    private Boolean status;
}