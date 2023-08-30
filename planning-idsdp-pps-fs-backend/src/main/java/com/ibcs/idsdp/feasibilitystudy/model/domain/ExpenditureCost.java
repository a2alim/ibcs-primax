package com.ibcs.idsdp.feasibilitystudy.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "fsp_expenditure_costs")
@EntityListeners(AuditingEntityListener.class)
public class ExpenditureCost extends BaseEntity {

    private Long economicCodeId;

    private Long economicSubCodeId;

    private String description;

    private Double totalAmount;

    private Double gobAmount;

    private Double feGobAmount;

    private Double paAmount;

    private Double rpaAmount;

    private Double rpaGobAmount;

    private Double rpaSpecialAccountAmount;

    private Double dpaAmount;

    private Double dpaThroughPdAmount;

    private Double dpaDpAmount;

    private Double ownFundAmount;

    private Double feOwnFundAmount;

    private Double othersAmount;

    private Double othersFeAmount;

    private Long fspMasterId;

}
