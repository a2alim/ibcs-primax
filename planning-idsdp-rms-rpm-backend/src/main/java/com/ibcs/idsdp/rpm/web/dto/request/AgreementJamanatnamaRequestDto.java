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
public class AgreementJamanatnamaRequestDto extends UuidIdHolderRequestBodyDTO {

    private Long agreementId;
    private AgreementWithResearcher agreementWithResearcherId;
    private String fileDownloadUrlImage;
    private String bucketNameImage;
    private String fileNameImage;
    private String guarantorName;
    private String fathersName;
    private String presentAddress;
    private String permanentAddress;
    private String emailAddress;
    private String nidNumber;
    private String mobileNumber;
    private String firstPage;
    private String secondPage;
    private String thirdPage;
    private String fourthPage;
    private String fileDownloadUrlSignature;
    private String bucketNameSignature;
    private String fileNameSignature;
    private boolean isEditable;
    private String mode;
    private String motherName;
    private String tinNo;
    private Long refundPeriod;
}
