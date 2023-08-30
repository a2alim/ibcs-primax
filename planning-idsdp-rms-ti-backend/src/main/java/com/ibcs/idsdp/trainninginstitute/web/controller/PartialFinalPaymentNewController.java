package com.ibcs.idsdp.trainninginstitute.web.controller;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;
import com.ibcs.idsdp.trainninginstitute.services.PartialFinalPaymentNewService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PartialFinalPaymentNewRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PartialFinalPaymentNewResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PreviousPaymentResponse;
import com.ibcs.idsdp.util.Response;

@RestApiController
@RequestMapping("/partial-final-payment-new")
public class PartialFinalPaymentNewController extends	BaseController<PartialFinalPaymentNewModel, PartialFinalPaymentNewRequestDto, PartialFinalPaymentNewResponseDto> {

	private final PartialFinalPaymentNewService partialFinalPaymentNewService;

	public PartialFinalPaymentNewController(
			BaseService<PartialFinalPaymentNewModel, PartialFinalPaymentNewRequestDto, PartialFinalPaymentNewResponseDto> service,
			PartialFinalPaymentNewService partialFinalPaymentNewService) {
		super(service);
		this.partialFinalPaymentNewService = partialFinalPaymentNewService;
	}

	@GetMapping("/previous-payments/{proposalId}")
	public Response<PreviousPaymentResponse> getPreviousPayments(@PathVariable Long proposalId) {
		return partialFinalPaymentNewService.getPreviousPayments(proposalId);
	}

	@GetMapping(path = "/grid-list" + "/{page}" + "/{size}/{traningInsId}", produces = "application/json")
	public @ResponseBody Response<PartialFinalPaymentNewResponseDto> gridList(@PathVariable("page") int page, @PathVariable("size") int size,
			@PathVariable("traningInsId") Long traningInsId) {
		return partialFinalPaymentNewService.gridList(new PageableRequestBodyDTO() {
			{
				setPage(page);
				setSize(size);
			}
		}, traningInsId);
	}
	
	
	@PutMapping("/change-status/{id}")
    public  Response<PartialFinalPaymentNewResponseDto> changeStatus(@PathVariable Long id, @RequestParam Status status) {
        return partialFinalPaymentNewService.changeStatus(id, status);
    }

}
