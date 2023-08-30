package com.ibcs.idsdp.projectconcept.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;


@Entity
@Table(name = "test")
@EntityListeners(AuditingEntityListener.class)
@Data
public class Test extends BaseEntity {

    private String code;
    private String nameEn;
    private String nameBn;
    private String shortName;
    private String description;
    private String status;


}
