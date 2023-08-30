package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class CreateSeminarUploadFilesScheduleRequestDto extends UuidIdHolderRequestBodyDTO {

    private Long seminarId;
    private CreateSeminar m2CreateSeminarId;
    private String fileTitle;
    private String fileDownloadUrl;
    private String bucketName;
    private String fileName;
    private Boolean isEditable;

}
