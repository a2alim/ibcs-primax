package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class FinancialYears extends UuidIdHolderRequestBodyDTO {

    private String  fiscalYear;

    private int month;

    private Double financialAmount;

    private Double percentageOfItem;

    private Double percentageOfProject;

    private Double totalFinancialAmount;

    private Double totalPercentageOfItem;

    private Double totalPercentageOfProject;

}
