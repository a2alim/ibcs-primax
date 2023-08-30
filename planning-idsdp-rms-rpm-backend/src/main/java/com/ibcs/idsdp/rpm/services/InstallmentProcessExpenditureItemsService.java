package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessExpenditureItems;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementInstallmentRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessExpenditureItemsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessExpenditureItemsResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;

import java.util.List;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface InstallmentProcessExpenditureItemsService {


    Response<InstallmentProcessExpenditureItemsResponseDto> createList(List<InstallmentProcessExpenditureItemsRequestDto> requestDto);

    Response getByProcessId(Long processId);

    List<InstallmentProcessExpenditureItems> findAllByM2InstallmentProcessId(Long id);
}
