package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "upa_zilla")
@EntityListeners(AuditingEntityListener.class)
public class UpaZilla extends BaseEntity {

    @ManyToOne
    @JoinColumn(name = "zilla_id")
    private Zilla zilla;
    private String code;
    private String geoCode;
    private String nameEn;
    private String nameBn;
    private String description;
    private Boolean status;

}