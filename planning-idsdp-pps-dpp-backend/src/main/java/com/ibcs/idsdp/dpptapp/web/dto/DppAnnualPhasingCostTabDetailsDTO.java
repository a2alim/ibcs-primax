package com.ibcs.idsdp.dpptapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.EconomicCode;
import com.ibcs.idsdp.dpptapp.web.dto.response.SubEconomicCode;
import com.ibcs.idsdp.dpptapp.web.dto.response.UnitType;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotEmpty;
import javax.validation.constraints.NotNull;
import java.util.List;

@Setter
@Getter
public class DppAnnualPhasingCostTabDetailsDTO extends UuidIdHolderRequestBodyDTO {

    private Long attachmentId;

    private Boolean isBasis;

    private Boolean isMajor;

    private Long dppAnnualPhasingCostId;

    private Long economicCodeId;

    private Long subEconomicCodeId;

    private String description;

    private Long unitId;

    private Double unitCost;

    private Double qty;

    private Double totalAmount;

    @NotNull
    private Double gobAmount;

    @NotNull
    private Double gobFeAmount;

    @NotNull
    private Double gobThruAmount;

    @NotNull
    private Double spAcAmount;

    @NotNull
    private Double thruPdAmount;

    @NotNull
    private Double thruDpAmount;

    @NotNull
    private Double ownFundAmount;

    @NotNull
    private Double ownFundFeAmount;

    @NotNull
    private Double otherAmount;

    @NotNull
    private Double otherFeAmount;

    private FiscalYearWiseItemTotalDTO fiscalYearsWiseItemTotal;

    @NotEmpty
    private List<DppFiscalYearDTO> fiscalYears;

    private EconomicCode economicCodeDTO;

    private SubEconomicCode subEconomicCodeDTO;

    private UnitType unitTypeDTO;
}
