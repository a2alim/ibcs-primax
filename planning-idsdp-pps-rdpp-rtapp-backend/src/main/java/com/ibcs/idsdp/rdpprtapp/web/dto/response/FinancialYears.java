package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FinancialYears extends UuidIdHolderRequestBodyDTO {

    private String  fiscalYear;

    private int month;

    private Double financialAmount;

    private Double percentageOfItem;

    private Double percentageOfProject;

}
