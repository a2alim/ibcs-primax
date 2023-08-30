package com.ibcs.idsdp.trainninginstitute.services;

import java.util.List;
import java.util.Optional;

import org.springframework.web.multipart.MultipartFile;

import com.ibcs.idsdp.trainninginstitute.web.dto.request.PaymentBillVoucherNewRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaymentBillVoucherNewResponseDto;
import com.ibcs.idsdp.util.Response;

public interface PaymentBillVoucherNewService {
	
	Response<PaymentBillVoucherNewResponseDto> getListFindByPartialFinalPaymentId(Long partialFinalPaymentId);
	Response<PaymentBillVoucherNewResponseDto> createList(List<PaymentBillVoucherNewRequestDto> requestDtoList);
	Response<PaymentBillVoucherNewResponseDto> uploadDocument(String data, Optional<MultipartFile> file);

}
