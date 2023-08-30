package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppLocationWiseBreakdownRequest extends UuidIdHolderRequestBodyDTO {


    private String projectConceptUuid;
    private Long projectConceptId;
    private Long[] division;
    private Long[] zilla;
    private Long[] upazila;
    private String majorItem;
    private long estimatedCost;
    private String comments;
}
