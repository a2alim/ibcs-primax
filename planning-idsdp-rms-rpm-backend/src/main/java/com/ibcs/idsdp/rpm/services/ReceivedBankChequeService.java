package com.ibcs.idsdp.rpm.services;

import org.springframework.data.domain.Page;

import com.ibcs.idsdp.rpm.web.dto.request.ReceivedBankChequeRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeResponseDto;
import com.ibcs.idsdp.util.Response;

public interface ReceivedBankChequeService {

	Response<ReceivedBankChequeResponseDto> save(ReceivedBankChequeRequestDto receivedBankChequeRequestDto);

	Page<ReceivedBankChequeResponseDto> getAllReceivedBanlCheque(ReceivedBankChequeRequestDto receivedBankChequeRequestDto);

	Response<ReceivedBankChequeResponseDto> deleteByid(Long id);
}
