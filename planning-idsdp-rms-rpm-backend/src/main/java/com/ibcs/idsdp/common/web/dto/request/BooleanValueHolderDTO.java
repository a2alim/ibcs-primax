package com.ibcs.idsdp.common.web.dto.request;

import java.time.LocalDate;

import lombok.Data;

@Data
public class BooleanValueHolderDTO  {

    private boolean success;
    private String message;
    private LocalDate advertisementStartDate; 
    private LocalDate advertisementEndDate;
    private Long stFiscalYearId;
}
