package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class TappQualificationSupportStuffRequest extends UuidIdHolderRequestBodyDTO {

    private String projectConceptUuid;
    private Long projectConceptId;
    private Double gobFund;
    private Double rpaFund;
    private Double dpaFund;
    private Double others;
    private Boolean status;

    private List<TappSupportStuffRequest> tappSupportStuffList;
}
