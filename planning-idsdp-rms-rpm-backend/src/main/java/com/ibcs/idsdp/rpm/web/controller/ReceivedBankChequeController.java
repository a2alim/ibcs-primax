package com.ibcs.idsdp.rpm.web.controller;

import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.constants.ReceivedBankChequeConstant;
import com.ibcs.idsdp.rpm.model.domain.ReceivedBankCheque;
import com.ibcs.idsdp.rpm.services.ReceivedBankChequeService;
import com.ibcs.idsdp.rpm.web.dto.request.ReceivedBankChequeRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ReceivedBankChequeResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping(ReceivedBankChequeConstant.RECEIVED_BANK_CHEQUE)
public class ReceivedBankChequeController extends BaseController<ReceivedBankCheque, ReceivedBankChequeRequestDto, ReceivedBankChequeResponseDto>{

	final private ReceivedBankChequeService receivedBankChequeService;
	
	public ReceivedBankChequeController(BaseService<ReceivedBankCheque, ReceivedBankChequeRequestDto, ReceivedBankChequeResponseDto> service, ReceivedBankChequeService receivedBankChequeService) {
		super(service);
		this.receivedBankChequeService = receivedBankChequeService;
	}

	@PostMapping(ReceivedBankChequeConstant.SAVE)
	public Response<ReceivedBankChequeResponseDto> create(@RequestBody ReceivedBankChequeRequestDto receivedBankChequeRequestDto){
		return receivedBankChequeService.save(receivedBankChequeRequestDto);
	}

	@PostMapping(ReceivedBankChequeConstant.GET_ALL_RECEIVED_BANK_CHEQUE)
	public Page<ReceivedBankChequeResponseDto> getAllReceivedBanlCheque(@RequestBody ReceivedBankChequeRequestDto receivedBankChequeRequestDto){
		return receivedBankChequeService.getAllReceivedBanlCheque(receivedBankChequeRequestDto);
	}

	@DeleteMapping(ReceivedBankChequeConstant.DELETE_BY_ID)
	public Response<ReceivedBankChequeResponseDto> deleteByid(@PathVariable Long id){
		return receivedBankChequeService.deleteByid(id);
	}
}
