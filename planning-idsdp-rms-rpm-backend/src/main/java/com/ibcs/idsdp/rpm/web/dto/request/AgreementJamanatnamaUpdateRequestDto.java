package com.ibcs.idsdp.rpm.web.dto.request;

import lombok.Data;

import javax.persistence.Column;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class AgreementJamanatnamaUpdateRequestDto {

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
    private boolean isEditable;
    private String mode;
    private String motherName;
    private String tinNo;
    private Long refundPeriod;
}
