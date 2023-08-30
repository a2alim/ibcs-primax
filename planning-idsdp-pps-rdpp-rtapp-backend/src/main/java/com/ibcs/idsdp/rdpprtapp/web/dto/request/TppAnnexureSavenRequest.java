package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class TppAnnexureSavenRequest extends UuidHolderRequestBodyDTO {
    private Long id;
    private String letterOfAgreement;
    private Long projectConceptMasterId;
    private String projectConceptUuid;
}
