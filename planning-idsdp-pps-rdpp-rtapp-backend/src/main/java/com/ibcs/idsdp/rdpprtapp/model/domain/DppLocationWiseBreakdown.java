package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "rdpp_location_wise_cost_breakdown")
@EntityListeners(AuditingEntityListener.class)
public class DppLocationWiseBreakdown extends BaseEntity {

    @NotNull
    private String projectConceptMasterUuid;

    @NotNull
    private Long projectConceptMasterId;


    @Column(name = "rdpp_master_id")
    private Long rdppMasterId;

    @NotNull
    private Long divisionId;

    private Long zillaId;

    private Long upazilaId;

    @NotNull
    @Column(columnDefinition = "TEXT")
    private String quantity;

    @NotNull
    private Double estimatedCost;

    private String comment;
}
