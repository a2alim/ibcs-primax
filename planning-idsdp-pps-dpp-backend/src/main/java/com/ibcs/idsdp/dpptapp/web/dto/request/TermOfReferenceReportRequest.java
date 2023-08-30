package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import javax.persistence.Column;

@Data
public class TermOfReferenceReportRequest extends UuidIdHolderRequestBodyDTO {
    private String pcUuid;
    private Long reportIndex;
    private String termOfReference;
}
