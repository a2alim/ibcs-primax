package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class TappFiscalYearDTO extends UuidIdHolderRequestBodyDTO {

    private Long tappAnnualPhasingCostTabDetailsId;

    @NotBlank
    private String fiscalYear;

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

    @NotNull
    private Double totalAmount;

    private Long quantity;

    private TappAnnualPhasingCostTotalDTO tappAnnualPhasingCostTotalDTO;
}
