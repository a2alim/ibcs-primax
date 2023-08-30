package com.ibcs.idsdp.rmsConfigration.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.Table;

@Data
@Entity
@Table(name = "st_installment_pay_rules")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class InstallmentPayRule extends BaseEntity {

    @Column(name = "st_fiscal_year_id", nullable = false, length = 100)
    private Integer stFiscalYearId;
    @Column(name = "st_installment_type_id", nullable = false, length = 100)
    private Integer stInstallmentTypeId;
    @Column(name = "pay_inst_percentage_amount")
    private Double payInstPercentageAmount;
    @Column(name = "active", nullable = false)
    private Boolean active;


}




