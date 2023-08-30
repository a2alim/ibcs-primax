package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import com.sun.istack.NotNull;
import lombok.Data;

import javax.persistence.Column;

@Data
public class TppAnnexureSavenRequest extends UuidHolderRequestBodyDTO {
    private Long id;
    private String letterOfAgreement;
    private Long projectConceptMasterId;
    private String projectConceptUuid;
}
