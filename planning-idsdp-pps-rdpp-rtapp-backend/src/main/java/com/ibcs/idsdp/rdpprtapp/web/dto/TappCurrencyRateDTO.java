package com.ibcs.idsdp.rdpprtapp.web.dto;

import lombok.Data;

import java.time.LocalDate;

@Data
public class TappCurrencyRateDTO {

    private Double exchangeRate;
    private Long exchangeCurrency;
    private LocalDate exchangeDate;
}
