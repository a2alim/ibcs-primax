package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessExpenditureItems;
import com.ibcs.idsdp.rpm.services.InstallmentProcessExpenditureItemsService;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessExpenditureItemsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessExpenditureItemsResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/installment-process-expenditure-items")
public class InstallmentProcessExpenditureItemsController extends BaseController<InstallmentProcessExpenditureItems, InstallmentProcessExpenditureItemsRequestDto, InstallmentProcessExpenditureItemsResponseDto> {

    private final InstallmentProcessExpenditureItemsService installmentProcessExpenditureItemsService;

    public InstallmentProcessExpenditureItemsController(BaseService<InstallmentProcessExpenditureItems, InstallmentProcessExpenditureItemsRequestDto, InstallmentProcessExpenditureItemsResponseDto> service, InstallmentProcessExpenditureItemsService installmentProcessExpenditureItemsService) {
        super(service);
        this.installmentProcessExpenditureItemsService = installmentProcessExpenditureItemsService;
    }

    @PostMapping(path = "/create-list", produces = "application/json")
    public Response<InstallmentProcessExpenditureItemsResponseDto> saveAgreementInstallment(@RequestBody List<InstallmentProcessExpenditureItemsRequestDto> requestDto) {
        Response<InstallmentProcessExpenditureItemsResponseDto> expenditureBudget = installmentProcessExpenditureItemsService.createList(requestDto);
        return expenditureBudget;
    }


    @GetMapping(path = "/get-by-process-id/{processId}", produces = "application/json")
    public Response saveAgreementInstallment(@PathVariable("processId") Long processId) {
        Response expenditureBudget = installmentProcessExpenditureItemsService.getByProcessId(processId);
        return expenditureBudget;
    }


}
