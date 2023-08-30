package com.ibcs.idsdp.trainninginstitute.web.controller;

import java.util.List;
import java.util.Optional;

import org.springframework.http.MediaType;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.model.domain.PaymentBillVoucherNewModel;
import com.ibcs.idsdp.trainninginstitute.services.PaymentBillVoucherNewService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PaymentBillVoucherNewRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaymentBillVoucherNewResponseDto;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("/payment-bill-voucher-new")
public class PaymentBillVoucherNewController extends BaseController<PaymentBillVoucherNewModel, PaymentBillVoucherNewRequestDto, PaymentBillVoucherNewResponseDto>{

	private final  PaymentBillVoucherNewService billVoucherNewService;
	
	public PaymentBillVoucherNewController(BaseService<PaymentBillVoucherNewModel, PaymentBillVoucherNewRequestDto, PaymentBillVoucherNewResponseDto> service, PaymentBillVoucherNewService billVoucherNewService) {
		super(service);	
		this.billVoucherNewService = billVoucherNewService;
	}
	
	
	@GetMapping(path = "/find-by-partial-final-payment-id/{partialFinalPaymentId}", produces = "application/json")
	public Response<PaymentBillVoucherNewResponseDto> getListFindByPartialFinalPaymentId(@PathVariable("partialFinalPaymentId") Long partialFinalPaymentId) {
		return billVoucherNewService.getListFindByPartialFinalPaymentId(partialFinalPaymentId);
	}


	@PostMapping(path = "/create-list", produces = "application/json")
	public Response<PaymentBillVoucherNewResponseDto> createList(@RequestBody List<PaymentBillVoucherNewRequestDto> requestDtoList) {
		return billVoucherNewService.createList(requestDtoList);
	}
	
	@PostMapping(value = "/upload-doc-files", consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
	public Response<PaymentBillVoucherNewResponseDto> uploadDocument(@RequestParam("data") String data,	@RequestParam("file") Optional<MultipartFile> file) {
		return billVoucherNewService.uploadDocument(data, file);
	}

}
