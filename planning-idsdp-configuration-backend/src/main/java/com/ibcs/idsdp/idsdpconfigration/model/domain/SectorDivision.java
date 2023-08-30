package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;


@Data
@Entity
@Table(name = "sector_division")
@EntityListeners(AuditingEntityListener.class)
public class SectorDivision extends BaseEntity {
    private String code;
    private String sectorDivisionCode;
    private String sectorDivisionNameEn;
    private String sectorDivisionNameBn;
    private String description;
    private Boolean status;
}
