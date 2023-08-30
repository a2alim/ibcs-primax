package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "gis_location")
@EntityListeners(AuditingEntityListener.class)
public class GisLocation extends BaseEntity {
    @NotNull
    private String divisionGeoCode;
    private String zillaGeoCode;
    private String upazilaGeoCode;
    @NotNull
    private Long projectConceptMasterId;
    @NotNull
    private Long sourceModuleId;
    @NotNull
    private String sourceModuleType;
}
