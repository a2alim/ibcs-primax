package com.ibcs.idsdp.dpptapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.EntityListeners;
import javax.persistence.Table;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "dpp_item_wise_cost_estimated")
@EntityListeners(AuditingEntityListener.class)
public class ItemWiseCostEstimated extends BaseEntity {

    private String majorItem;

    private String description;

    private Long unit;

    private Double unitCost;

    @Column(columnDefinition = "TEXT")
    private String basis;

    @Column(columnDefinition = "TEXT")
    private String source;

    private LocalDate itemWiseCostDate;

}
