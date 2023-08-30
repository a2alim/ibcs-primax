package com.ibcs.idsdp.trainninginstitute.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.*;
import org.hibernate.annotations.Cache;
import org.hibernate.annotations.CacheConcurrencyStrategy;

import javax.persistence.CascadeType;
import javax.persistence.Entity;
import javax.persistence.OneToOne;
import javax.persistence.Table;

@ToString
@Builder
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Entity
@Table(name = "M3_PAYMENT_VOUCHER")
@Cache(usage = CacheConcurrencyStrategy.READ_WRITE)
public class PaymentVoucherModel extends BaseEntity {

    private Integer serialNo;

    @OneToOne(cascade = CascadeType.MERGE)
    private MinioAttachment boucherImage;

}
