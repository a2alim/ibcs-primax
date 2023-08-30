package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class DppProjectManagementSetupDto extends UuidIdHolderRequestBodyDTO {

    private Long attachmentId;

    private Long dppProjectManagementSetupMasterId;

    private String pcUuid;

    public List<DppPMSExistingRequest> existingSetup;

    public List<DppPMSExecutionRequest> executionSetup;

    public List<DppPMSOutsourcingRequest> outSourcing;

    private String imageOrPdf;
}
