package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "zilla")
@EntityListeners(AuditingEntityListener.class)
public class Zilla extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "division_id")
    private Division division;

    private String code;

    private String geoCode;

    private String nameEn;

    private String nameBn;

    private String description;

    private Boolean status;

}