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
@Table(name = "st_installment_type")
@Cache( usage = CacheConcurrencyStrategy.READ_WRITE)
public class InstallmentType extends BaseEntity {


    @Column(name = "installment_type", nullable = false, length = 250)
    private String installmentType;
    @Column(name = "active", nullable = false)
    private Boolean active;


}




