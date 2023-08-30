package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.time.LocalDate;

@Data
public class DppCurrencyRateDTO{

    private Double exchangeRate;
    private Long exchangeCurrency;
    private LocalDate exchangeDate;
}
