package com.ibcs.idsdp.rdpprtapp.web.dto.response;


import java.util.List;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;

import lombok.Data;

@Data
public class DetailsEstimatedCostResponse {
    private List<EstimatedCostAnnexureDTO> dppAnnualPhasingCostDTOList;
    private DppAnnualPhasingCostTotalDTO grandTotalResponses;
    
    
    //    for report
   	private EstimatedCostAnnexureDTO revenue;
   	private EstimatedCostAnnexureDTO capital;
   	EstimatedCostAnnexureDTO contingency;
   	private Boolean isForeignAid;
}
