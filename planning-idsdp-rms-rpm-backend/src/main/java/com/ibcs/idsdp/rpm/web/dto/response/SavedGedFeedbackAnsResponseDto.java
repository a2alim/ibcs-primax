package com.ibcs.idsdp.rpm.web.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;


@Data
public class SavedGedFeedbackAnsResponseDto extends UuidIdHolderRequestBodyDTO {
    private long stFiscalYearId;

    private String personName;

    private String designation;

    private String mobileNo;

    private String fileDownloadUrl;

    private String bucketName;
    private String fileName;
    private String emailAddress;
    private String mode;
}
