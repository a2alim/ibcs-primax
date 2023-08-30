package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "priority")
public class Priority extends BaseEntity {

    private String code;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;
}
