package com.ibcs.idsdp.rdpprtapp.model.domain;

import com.ibcs.idsdp.common.model.domain.BaseEntity;
import lombok.Data;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import javax.persistence.*;
import java.time.LocalDate;

@Data
@Entity
@Table(name = "rdpp_currency_rates")
@EntityListeners(AuditingEntityListener.class)
public class DppCurrencyRate extends BaseEntity {

    @Column(name="exchange_rate")
    private Double exchangeRate;

    @Column(name="exchange_currency")
    private Long exchangeCurrency;

    @Column(name="exchange_date")
    private LocalDate exchangeDate;

}
