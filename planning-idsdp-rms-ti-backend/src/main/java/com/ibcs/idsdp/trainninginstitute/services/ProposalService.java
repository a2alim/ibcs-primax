package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PagableRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ProposalRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.*;
import com.ibcs.idsdp.util.Response;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestBody;

import java.util.List;

public interface ProposalService {
	
	Response<ProposalRequest> createProposal(ProposalRequest proposalRequest);
	Response<ProposalRequest> editProposal(ProposalRequest proposalRequest);

    ResponseEntity<PaginationResponse<List<ProposalResponse>>> getProposalList(int pageNo, int pageSize, String proposalTitle);    

    ResponseEntity<ApiMessageResponse> deleteProposal(Long proposalId);

    ResponseEntity<ProposalResponse> getSingleProposal(Long proposalId);

    ProposalListView getAllProposalByUuid(String uuid);

    ResponseEntity<List<ProposalListResponse>> getAllProposalByInstProfileId(Long id);

    ResponseEntity<ProposalModel> submitProposal(Long proposalId);

    ResponseEntity<List<ProposalResponse>> getAllProposalList();

    ResponseEntity<List<ProposalModel>> getAllProposalByParticipant(Long participantId);
    
    Response<ProposalRequest> findByFiscalYearId(ProposalRequest proposalRequest);

    Response<ProposalResponse> getProposalList(PagableRequestDto pagableRequestDto);

}
