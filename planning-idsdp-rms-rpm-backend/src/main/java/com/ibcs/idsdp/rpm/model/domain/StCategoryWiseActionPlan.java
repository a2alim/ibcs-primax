package com.ibcs.idsdp.rpm.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;

import javax.persistence.Entity;
import javax.persistence.Table;
import javax.validation.constraints.NotNull;
@Data
@Entity
@Table(name = "st_category_wise_action_plan")
public class StCategoryWiseActionPlan extends BaseEntity {
    @NotNull
    private Long stFiscalYearId;
    @NotNull
    private Long stResearchCategoryTypeId;
    @NotNull
    private String taskName;
    @NotNull
    private Integer totalDays;
    @NotNull
    private Boolean isActive;
}
