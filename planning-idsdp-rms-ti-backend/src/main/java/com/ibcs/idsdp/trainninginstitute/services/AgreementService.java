package com.ibcs.idsdp.trainninginstitute.services;

import java.util.List;

import org.springframework.http.ResponseEntity;

import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.AgreementStatus;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AgreementRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AgreementInstallmentResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.AgreementViewList;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;

public interface AgreementService {
	
    ResponseEntity<ApiMessageResponse> createAgreement(AgreementRequest agreementRequest);

    ResponseEntity<PaginationResponse<List<AgreementModel>>> getAgreements(int pageNo, int pageSize, String search);

    ResponseEntity<ApiMessageResponse> deleteAgreement(Long agreementId);

    ResponseEntity<ApiMessageResponse> editAgreement(Long agreementId, AgreementRequest agreementRequest);

    ResponseEntity<AgreementModel> getSingleAgreement(Long agreementId);

    ResponseEntity<ApiMessageResponse> changeStatus(Long agreementId, AgreementStatus agreementStatus);

    AgreementViewList getAllAgreementLetter(Long uuid);

    ResponseEntity<AgreementModel> getAgreementByProposalId(Long id);

    ResponseEntity<List<AgreementInstallmentResponse>> getInstallmentsByProposalId(Long proposalId);
    
    ResponseEntity<List<AgreementModel>> findProposalList();

}
