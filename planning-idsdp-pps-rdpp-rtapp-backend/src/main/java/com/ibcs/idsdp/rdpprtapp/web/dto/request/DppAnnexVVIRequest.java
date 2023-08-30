package com.ibcs.idsdp.rdpprtapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidHolderRequestBodyDTO;
import lombok.Data;

@Data
public class DppAnnexVVIRequest extends UuidHolderRequestBodyDTO {
    private String projectConceptUuid;
    private Long projectConceptMasterId;
    private Long attachmentId;
    private String currentFile;
}
