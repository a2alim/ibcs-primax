package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;

@Data
@Entity
@Table(name = "fsp_mode_of_finances")
@EntityListeners(AuditingEntityListener.class)
public class ModeOfFinance extends BaseEntity {
    @NotNull
    private Long modeFinId;
    @NotNull
    private Double totalAmount;
    @NotNull
    private Double gobAmount;
    @NotNull
    private Double feGobAmount;
    @NotNull
    private Double ownFundAmount;
    @NotNull
    private Double feOwnFundAmount;
    @NotNull
    private Double paAmount;
    @NotNull
    private Double rpaAmount;
    @NotNull
    private Double dpaAmount;
    private Double otherAmount;
    private Double feOtherAmount;
    private Long paSourceId;
    @NotNull
    private Long fspMasterId;
}
