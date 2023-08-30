package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementInstallmentRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementWithResearcherRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface AgreementInstallmentService {

    Response<AgreementInstallmentResponseDto> createAgreementInstallment(AgreementInstallmentRequestDto agreementWithResearcherRequestDto);

    BooleanValueHolderDTO updateAgreementInstallment(AgreementInstallmentRequestDto agreementWithResearcherRequestDto);
    
    Response<AgreementInstallmentResponseDto> findAllByAgreementWithResearcherId(Long agreementWithResearcherId);
}
