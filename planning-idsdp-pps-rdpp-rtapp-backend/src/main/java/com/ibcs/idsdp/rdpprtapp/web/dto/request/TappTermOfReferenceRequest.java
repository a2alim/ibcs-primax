package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TappTermOfReferenceRequest extends UuidIdHolderRequestBodyDTO {

    private String institutionalAgreement;
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private String uuid;
}
