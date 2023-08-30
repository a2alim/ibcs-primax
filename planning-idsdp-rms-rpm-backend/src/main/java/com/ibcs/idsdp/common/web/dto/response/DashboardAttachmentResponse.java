package com.ibcs.idsdp.common.web.dto.response;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class DashboardAttachmentResponse extends UuidIdHolderRequestBodyDTO {
    private String title;
    private Attachment attachment;
}
