package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class CreateLetterForGedRequestDto extends UuidIdHolderRequestBodyDTO {
    private long stFiscalYearId;

    private String sendTo;

    private String subject;

    private String letterBodyContent;

    private String fileDownloadUrl;

    private String bucketName;
    private String fileName;
    private Integer sendingStatus;
    private String mode;
}
