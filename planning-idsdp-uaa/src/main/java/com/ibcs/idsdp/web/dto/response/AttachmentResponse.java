package com.ibcs.idsdp.web.dto.response;

import lombok.Data;

@Data
public class AttachmentResponse {
    private Long id;
    private String name;
    private String pathUrl;
    private String fileType;
    private String fileName;
}
