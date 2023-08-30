package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class DppAnnualPhasingCostDetails extends UuidIdHolderRequestBodyDTO {


    private Long economicCodeId;

    private Long subEconomicCodeId;

    private String description;

    private Long unitId;

    private Double unitCost;

    private Double qty;

    private Double totalAmount;

    private Double weight;

    private EconomicCode economicCodeDTO;

    private SubEconomicCode subEconomicCodeDTO;

    private UnitType unitTypeDTO;

    List<FinancialYears> years;


}
