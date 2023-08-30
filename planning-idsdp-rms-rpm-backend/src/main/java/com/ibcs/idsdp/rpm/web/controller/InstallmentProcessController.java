package com.ibcs.idsdp.rpm.web.controller;

import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.repositories.GoLetterRepository;
import com.ibcs.idsdp.rpm.services.InstallmentProcessService;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessResponseDto;
import com.ibcs.idsdp.util.Response;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/installment-process")
public class InstallmentProcessController extends BaseController<InstallmentProcess, InstallmentProcessRequestDto, InstallmentProcessResponseDto> {

    private final InstallmentProcessService installmentProcessService;


    public InstallmentProcessController(BaseService<InstallmentProcess, InstallmentProcessRequestDto, InstallmentProcessResponseDto> service, InstallmentProcessService installmentProcessService) {
        super(service);
        this.installmentProcessService = installmentProcessService;
    }

    @PostMapping(path = "/create-installment-process", produces = "application/json")
    public ResponseEntity<Response<InstallmentProcessResponseDto>> saveInstallmentProcess(@RequestBody InstallmentProcessRequestDto requestDto) {
        Response<InstallmentProcessResponseDto> installmentprocess = installmentProcessService.createAgreementInstallment(requestDto);
        return new ResponseEntity<Response<InstallmentProcessResponseDto>>(installmentprocess, HttpStatus.CREATED);
    }


    @PutMapping(path = "/installment-process-update", produces = "application/json")
    public ResponseEntity<BooleanValueHolderDTO> updateInstallmentProcess(@RequestBody InstallmentProcessRequestDto requestDto) {
        BooleanValueHolderDTO holderDTO = installmentProcessService.updateAgreementInstallment(requestDto);
        return new ResponseEntity<BooleanValueHolderDTO>(holderDTO, HttpStatus.OK);
    }

/*get
   proposal
    by
    uuId*/
    @GetMapping(path = "/proposal-uuid/{uuid}", produces = "application/json")
    public ResponseEntity<Response<Map<String,Object>>> getProposal(@PathVariable("uuid") String uuid) {
        Response<Map<String,Object>> response  =installmentProcessService.getProposal(uuid);
        return new ResponseEntity<Response<Map<String,Object>>>(response, HttpStatus.OK);
    }

    @GetMapping(path = "/getbyid/{id}", produces = "application/json")
    public Response<InstallmentProcessResponseDto> getInstallmentProcessById(@PathVariable("id") Long id){
    	return installmentProcessService.getInstallmentProcessById(id);
    }


    @GetMapping(path = "/Installment-by-uuid/{uuid}", produces = "application/json")
    public Response getInstallmentsList(@PathVariable("uuid") String uuid) {
        Response response  =installmentProcessService.getInstallments(uuid);
        return response;
    }


    @GetMapping(path = "/view-by-uuid/{uuid}", produces = "application/json")
    public Response viewInstallments(@PathVariable("uuid") String uuid) {
        Response response  =installmentProcessService.viewInstallments(uuid);
        return response;
    }


    @PostMapping(path = "/set-status", produces = "application/json")
    public Response setStatus(@RequestBody InstallmentProcess process) {
        Response response  =installmentProcessService.setStatus(process);
        return response;
    }

    @PutMapping(path = "/update-by-id/{id}/{uuid}", produces = "application/json")
    public BooleanValueHolderDTO updateStatus(@PathVariable("id") Long id,@PathVariable("uuid") String uuid) {
        BooleanValueHolderDTO booleanValueHolderDTO = installmentProcessService.doUpdateInstallment(id,uuid);
        return booleanValueHolderDTO;
    }




}
