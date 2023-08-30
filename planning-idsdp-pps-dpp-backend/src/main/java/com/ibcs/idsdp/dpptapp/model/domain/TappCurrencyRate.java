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
@Table(name = "tapp_currency_rates")
@EntityListeners(AuditingEntityListener.class)
public class TappCurrencyRate extends BaseEntity {

    @Column(name="exchange_rate")
    private Double exchangeRate;

    @Column(name="exchange_currency")
    private Long exchangeCurrency;

    @Column(name="exchange_date")
    private LocalDate exchangeDate;

}