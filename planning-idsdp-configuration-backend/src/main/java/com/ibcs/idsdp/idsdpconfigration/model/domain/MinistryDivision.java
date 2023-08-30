package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.sun.istack.NotNull;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "ministry_division")
@EntityListeners(AuditingEntityListener.class)
public class MinistryDivision extends BaseEntity {

    @NotNull
    @Column(length=128)
    private String code;

    @NotNull
    @Column(length=128)
    private String entryCode;

    @NotNull
    @Column(length=255)
    private String nameEn;

    @NotNull
    @Column(length=255)
    private String nameBn;

    @Column(length=255)
    private String shortName;

    @Column(length=1000)
    private String description;

    private Boolean status;
}
