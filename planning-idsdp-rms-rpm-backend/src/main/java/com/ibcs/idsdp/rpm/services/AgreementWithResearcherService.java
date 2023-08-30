package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementWithResearcherRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.StatusRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.Map;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface AgreementWithResearcherService {

    Response<AgreementWithResearcherResponseDto> createAgreementWithResearcher(AgreementWithResearcherRequestDto agreementWithResearcherRequestDto);

    BooleanValueHolderDTO updateAgreementWithResearcher(AgreementWithResearcherRequestDto agreementWithResearcherRequestDto);

    Response<Map<String, Object>> getAllTabData(String uuid);

    BooleanValueHolderDTO updateAgreementWithResearcherStatus(StatusRequestDto withResearcher);

    Response<AgreementWithResearcherResponseDto> findByResearcherProposalId(Long id);
    
    Response<AgreementWithResearcherResponseDto> findByResearcherProposalIdAndIsDeleted(Long id);   
    
    AgreementWithResearcher getByResearcherProposalId(Long id);
}
