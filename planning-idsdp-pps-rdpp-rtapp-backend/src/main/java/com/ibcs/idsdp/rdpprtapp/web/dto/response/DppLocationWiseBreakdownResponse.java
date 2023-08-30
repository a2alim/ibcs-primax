package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppLocationWiseBreakdownResponse extends UuidIdHolderRequestBodyDTO {

    private String code;
    private String division;
    private String district;
    private String upazila;
    private String majorItem;
    private long estimatedCost;
    private String comments;

}
