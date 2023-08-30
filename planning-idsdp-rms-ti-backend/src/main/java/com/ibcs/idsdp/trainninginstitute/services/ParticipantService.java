package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.model.domain.ParticipantModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.ParticipantRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ParticipantView;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;

public interface ParticipantService {
	
    ResponseEntity<ApiResponse<Long>> createParticipant(ParticipantRequest participantRequest);

    ResponseEntity<PaginationResponse<List<ParticipantModel>>> getParticipantList(int pageNo, int pageSize, String name);

    ResponseEntity<ApiMessageResponse> editParticipant(Long participantId, ParticipantRequest participantRequest);

    ResponseEntity<ApiMessageResponse> deleteParticipant(Long participantId);

    ResponseEntity<ParticipantModel> getParticipant(Long participantId);

    ParticipantView getParticipantView(Long id);

    ResponseEntity<List<ParticipantModel>> getParticipantsByCourseId(Long courseId);

    ResponseEntity<ApiMessageResponse> changeCompleteStatus(Long participantId, boolean completeStatus);
    
    ResponseEntity<List<ParticipantModel>> getParticipantsByProposalId(Long proposalId);
}
