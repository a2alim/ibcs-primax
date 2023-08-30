package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppFiscalYearDTO;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class DppContingencyResponse {
    private String projectConceptId;
    private double totalCostText;
    private double gobText;
    private double feText;
    private double thruGobText;
    private double spAcText;
    private double thruPdText;
    private double thruDpText;
    private double ownFundFeText;
    private double ownFeFundFeText;
    private double otherFeText;
    private double feOtherFeText;

    private List<DppFiscalYearDTO> fiscalYears;
}
