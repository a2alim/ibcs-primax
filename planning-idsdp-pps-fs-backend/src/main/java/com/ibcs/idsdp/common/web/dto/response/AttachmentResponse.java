package com.ibcs.idsdp.common.web.dto.response;

import lombok.Data;

@Data
public class AttachmentResponse {
    private Long id;
    private String pathUrl;
    private String fileType;
    private String fileName;
}
