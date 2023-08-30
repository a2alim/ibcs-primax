package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Getter;
import lombok.Setter;

import javax.validation.constraints.NotBlank;
import javax.validation.constraints.NotNull;

@Setter
@Getter
public class FiscalYearWiseItemTotalDTO extends UuidIdHolderRequestBodyDTO {

    private Long dppAnnualPhasingCostTabDetailsId;

    @NotBlank
    private String fiscalYear = "";

    @NotNull
    private Double gobAmount = 0.0;

    @NotNull
    private Double gobFeAmount = 0.0;;

    @NotNull
    private Double gobThruAmount = 0.0;;

    @NotNull
    private Double spAcAmount = 0.0;;

    @NotNull
    private Double thruPdAmount = 0.0;;

    @NotNull
    private Double thruDpAmount = 0.0;;

    @NotNull
    private Double ownFundAmount = 0.0;;

    @NotNull
    private Double ownFundFeAmount = 0.0;;

    @NotNull
    private Double otherAmount = 0.0;;

    @NotNull
    private Double otherFeAmount = 0.0;;

    @NotNull
    private Double totalAmount = 0.0;;

}
