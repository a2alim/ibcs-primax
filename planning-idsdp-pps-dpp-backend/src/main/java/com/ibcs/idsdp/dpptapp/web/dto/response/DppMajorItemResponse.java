package com.ibcs.idsdp.dpptapp.web.dto.response;

import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class DppMajorItemResponse {

    private String tabName;
    List<DppAnnualPhasingCostTabDetails> majorItem;

}
