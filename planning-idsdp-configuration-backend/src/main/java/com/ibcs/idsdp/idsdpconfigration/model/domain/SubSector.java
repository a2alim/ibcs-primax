package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "sub_sector")
@EntityListeners(AuditingEntityListener.class)
public class SubSector extends BaseEntity {

    private String code;
    private String subSectorCode;
    private String subSectorNameEn;
    private String subSectorNameBn;
    private String description;
    private Boolean status;
    private Long sectorId;
}
