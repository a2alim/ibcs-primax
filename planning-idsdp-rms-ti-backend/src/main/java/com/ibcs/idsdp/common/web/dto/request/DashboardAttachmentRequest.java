package com.ibcs.idsdp.common.web.dto.request;

import com.ibcs.idsdp.common.model.domain.MinioAttachment;
import lombok.Data;

@Data
public class DashboardAttachmentRequest {
    private String title;
    private MinioAttachment attachment;
}
