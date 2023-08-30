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
@Table(name = "currency")
@EntityListeners(AuditingEntityListener.class)
public class Currency extends BaseEntity {

    @Column(name = "generated_code")
    private String generatedCode;;

    @Column(name = "code")
    private String code;

    @Column(name = "name_en")
    private String nameEn;

    @Column(name = "name_bn")
    private String nameBn;

    @Column(name = "country")
    private String country;

    @Column(name = "description")
    private String description;

    @Column(name = "status")
    private Boolean status;

}