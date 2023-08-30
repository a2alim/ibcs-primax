package com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;

import lombok.Data;

/**
 * @author rakibul.hasan
 * @create 10/26/2021
 * @github `https://github.com/rhmtechno`
 */
@Data
public class AgreementInstallmentResponseDto extends UuidIdHolderRequestBodyDTO {
    private Long agreementId;
    private AgreementWithResearcher agreementWithResearcherId;
    private Long stInstallmentTypeId;
    private Integer percentageAmount;
    private Double tkAmount;
    private InstallmentTypeResponseDto installmentTypeResponseDto;
}
