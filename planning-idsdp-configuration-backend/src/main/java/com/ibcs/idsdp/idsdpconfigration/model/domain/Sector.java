package com.ibcs.idsdp.idsdpconfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;

@Data
@Entity
@Table(name = "sector")
@EntityListeners(AuditingEntityListener.class)
public class Sector extends BaseEntity {

    private String code;
    private String sectorCode;
    private String sectorNameEn;
    private String sectorNameBn;
    private String description;
    private Boolean status;

    @ManyToOne
    @JoinColumn(name = "sector_division_id")
    private SectorDivision sectorDivision;
}
