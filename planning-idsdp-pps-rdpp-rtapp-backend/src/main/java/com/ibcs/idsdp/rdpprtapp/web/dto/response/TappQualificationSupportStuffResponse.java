package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TappSupportStuffRequest;
import lombok.Data;

import java.util.List;

@Data
public class TappQualificationSupportStuffResponse extends UuidIdHolderRequestBodyDTO{


    private String uuid;
    private Double gobFund;
    private Double rpaFund;
    private Double dpaFund;
    private Double others;
    private Boolean status;

    public List<TappSupportStuffRequest> tappSupportStuffList;
}
