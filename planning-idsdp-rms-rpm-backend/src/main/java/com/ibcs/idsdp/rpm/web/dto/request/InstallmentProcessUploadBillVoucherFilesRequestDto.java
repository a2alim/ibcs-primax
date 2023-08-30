package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class InstallmentProcessUploadBillVoucherFilesRequestDto extends UuidIdHolderRequestBodyDTO {
    private Long agreementId;
    private InstallmentProcess m2InstallmentProcessId;
    private String fileTitle;
    private String fileDownloadUrlSignature;
    private String bucketNameSignature;
    private String fileNameSignature;
    private Boolean isEditable;
}
