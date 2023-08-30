package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappSupportStuffRequest extends UuidIdHolderRequestBodyDTO{

    private String designation;
    private String educationalQualification;
    private String experience;
    private String taskPerformed;
    private String uuid;
    private Long projectConceptMasterId;
    private String remarks;
    private String type;
}
