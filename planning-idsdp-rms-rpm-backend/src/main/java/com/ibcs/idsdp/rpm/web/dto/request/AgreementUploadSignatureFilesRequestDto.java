package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class AgreementUploadSignatureFilesRequestDto extends UuidIdHolderRequestBodyDTO {
    private Long agreementId;
    private AgreementWithResearcher agreementWithResearcherId;
    private String fileTitle;
    private String fileDownloadUrlSignature;
    private String bucketNameSignature;
    private String fileNameSignature;
    private boolean isEditable;
}
