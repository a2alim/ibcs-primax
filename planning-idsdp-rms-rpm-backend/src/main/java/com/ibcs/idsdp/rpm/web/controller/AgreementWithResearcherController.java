package com.ibcs.idsdp.rpm.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rpm.model.domain.AgreementWithResearcher;
import com.ibcs.idsdp.rpm.services.AgreementWithResearcherService;
import com.ibcs.idsdp.rpm.web.dto.request.AgreementWithResearcherRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.StatusRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@RestApiController
@RequestMapping("api/agreement-with-researcher")
public class AgreementWithResearcherController extends BaseController<AgreementWithResearcher, AgreementWithResearcherRequestDto, AgreementWithResearcherResponseDto> {

    final private AgreementWithResearcherService agreementWithResearcherService;

    public AgreementWithResearcherController(BaseService<AgreementWithResearcher, AgreementWithResearcherRequestDto, AgreementWithResearcherResponseDto> service, AgreementWithResearcherService agreementWithResearcherService) {
        super(service);
        this.agreementWithResearcherService = agreementWithResearcherService;
    }

    @PostMapping(path = "/create-agreement", produces = "application/json")
    public ResponseEntity<Response<AgreementWithResearcherResponseDto>> saveAgreement(@RequestBody AgreementWithResearcherRequestDto requestDto) {
        Response<AgreementWithResearcherResponseDto> agreementWithResearcher = agreementWithResearcherService.createAgreementWithResearcher(requestDto);
        return new ResponseEntity<Response<AgreementWithResearcherResponseDto>>(agreementWithResearcher, HttpStatus.CREATED);
    }


    @PutMapping(path = "/agreement-update", produces = "application/json")
    public ResponseEntity<BooleanValueHolderDTO> updateAgreement(@RequestBody AgreementWithResearcherRequestDto requestDto) {
        BooleanValueHolderDTO holderDTO = agreementWithResearcherService.updateAgreementWithResearcher(requestDto);
        return new ResponseEntity<BooleanValueHolderDTO>(holderDTO, HttpStatus.OK);
    }


    @PutMapping(path = "/agreement-update-status", produces = "application/json")
    public ResponseEntity<BooleanValueHolderDTO> updateAgreementStatus(@RequestBody StatusRequestDto requestDto) {
        BooleanValueHolderDTO holderDTO = agreementWithResearcherService.updateAgreementWithResearcherStatus(requestDto);
        return new ResponseEntity<BooleanValueHolderDTO>(holderDTO, HttpStatus.OK);
    }


    @GetMapping(path = "/agreement-all/{uuid}", produces = "application/json")
    public ResponseEntity<Response<Map<String, Object>>> saveAgreement(@PathVariable("uuid") String uuid) {
        Response<Map<String, Object>> AllTabData = agreementWithResearcherService.getAllTabData(uuid);
        return new ResponseEntity<Response<Map<String, Object>>>(AllTabData, HttpStatus.CREATED);
    }

    @GetMapping(path = "/getByResearcherProposalId/{id}", produces = "application/json")
    public Response<AgreementWithResearcherResponseDto> getByResearcherProposalId(@PathVariable Long id){
    	return agreementWithResearcherService.findByResearcherProposalId(id);
    }


}
