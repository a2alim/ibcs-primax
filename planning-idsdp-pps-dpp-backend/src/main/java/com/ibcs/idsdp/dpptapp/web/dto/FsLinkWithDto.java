package com.ibcs.idsdp.dpptapp.web.dto;

import lombok.Data;

@Data
public class FsLinkWithDto {
    private String fsUuid;
    private Long fsAttachmentId;
    private String pcUuid;
    private Long dppMasterId;
}
