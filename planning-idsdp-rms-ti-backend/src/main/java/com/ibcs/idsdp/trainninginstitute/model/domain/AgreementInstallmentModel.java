package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.Entity;
import javax.persistence.Table;

@ToString
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_AGREEMENT_INSTALLMENT")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class AgreementInstallmentModel extends BaseEntity {

    private String installmentName;

    private Integer percentageOfInstallment;

    private Double totalAmount;
}
