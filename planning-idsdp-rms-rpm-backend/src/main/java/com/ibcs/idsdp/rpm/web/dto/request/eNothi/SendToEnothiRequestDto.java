package com.ibcs.idsdp.rpm.web.dto.request.eNothi;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.List;

@Data
public class SendToEnothiRequestDto extends UuidIdHolderRequestBodyDTO {
    private List<EnothiReportListRequestDto> reportList;
    private String sourceModule;
    private String application_subject;
    private String data;
    private String projectConceptUuid;
    private String srcUserGroup;
    private String name;
    private String url;
}
