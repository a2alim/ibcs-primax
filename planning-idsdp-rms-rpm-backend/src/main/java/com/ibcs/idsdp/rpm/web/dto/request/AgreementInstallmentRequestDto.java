package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import lombok.Data;

import javax.persistence.Column;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class AgreementInstallmentRequestDto  extends UuidIdHolderRequestBodyDTO {
    private Long agreementId;
    private Double grandTotal;
    private  AgreementWithResearcher agreementWithResearcherId;
    private Long stInstallmentTypeId;
    private Integer percentageAmount;
    private Double tkAmount;
}
