package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappConsultantRequest extends UuidIdHolderRequestBodyDTO {

    private String consultants;
    private String educationalQualification;
    private String experience;
    private String responsibilities;
    private String projectId;
}
