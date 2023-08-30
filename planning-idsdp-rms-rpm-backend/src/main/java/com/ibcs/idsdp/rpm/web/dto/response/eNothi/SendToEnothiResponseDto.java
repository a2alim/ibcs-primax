package com.ibcs.idsdp.rpm.web.dto.response.eNothi;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.web.dto.request.eNothi.EnothiReportListRequestDto;
import lombok.Data;

import java.util.List;

@Data
public class SendToEnothiResponseDto extends UuidIdHolderRequestBodyDTO {
    private List<EnothiReportListRequestDto> reportList;
    private String sourceModule;
    private String application_subject;
    private String data;
    private String projectConceptUuid;
    private String srcUserGroup;
    private String name;
    private String url;
}
