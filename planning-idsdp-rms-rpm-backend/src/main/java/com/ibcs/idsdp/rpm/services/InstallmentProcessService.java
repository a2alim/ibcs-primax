package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementInstallmentRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;
import java.util.Map;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface InstallmentProcessService {


    Response<InstallmentProcessResponseDto> createAgreementInstallment(InstallmentProcessRequestDto requestDto);

    BooleanValueHolderDTO updateAgreementInstallment(InstallmentProcessRequestDto requestDto);

    Response<Map<String,Object>> getProposal(String uuid);

    Response getInstallments(String uuid);

    Response viewInstallments(String uuid);

    Response setStatus(InstallmentProcess process);

    Response<InstallmentProcessResponseDto> getInstallmentProcessById(Long id);

    List<InstallmentProcess> findAllByM1ResearcherProposalId(Long id);

    BooleanValueHolderDTO doUpdateInstallment(Long id,String uuid);
}
