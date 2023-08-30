package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.AgreementInstallment;
import com.ibcs.idsdp.rpm.services.AgreementInstallmentService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementInstallmentRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/agreement-installment")
public class AgreementInstallmentController extends BaseController<AgreementInstallment, AgreementInstallmentRequestDto, AgreementInstallmentResponseDto> {

    private final AgreementInstallmentService installmentService;

    public AgreementInstallmentController(BaseService<AgreementInstallment, AgreementInstallmentRequestDto, AgreementInstallmentResponseDto> service, AgreementInstallmentService installmentService) {
        super(service);
        this.installmentService = installmentService;
    }

    @PostMapping(path = "/create-agreement-installment", produces = "application/json")
    public ResponseEntity<Response<AgreementInstallmentResponseDto>> saveAgreementInstallment(@RequestBody AgreementInstallmentRequestDto requestDto) {
        Response<AgreementInstallmentResponseDto> agreementWithResearcher = installmentService.createAgreementInstallment(requestDto);
        return new ResponseEntity<Response<AgreementInstallmentResponseDto>>(agreementWithResearcher, HttpStatus.CREATED);
    }


    @PutMapping(path = "/agreement-installment-update", produces = "application/json")
    public ResponseEntity<BooleanValueHolderDTO> updateAgreementInstallment(@RequestBody AgreementInstallmentRequestDto requestDto) {
        BooleanValueHolderDTO holderDTO = installmentService.updateAgreementInstallment(requestDto);
        System.out.println(holderDTO);
        return new ResponseEntity<BooleanValueHolderDTO>(holderDTO, HttpStatus.OK);
    }
    
    
    


}
