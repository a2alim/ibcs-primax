package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.trainninginstitute.enums.AwardLetterStatus;
import com.ibcs.idsdp.trainninginstitute.model.domain.AwardLetterModel;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.AwardLetterRequest;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface AwardLetterService {
    ResponseEntity<ApiMessageResponse> createAwardLetter(AwardLetterRequest awardLetterRequest);

    ResponseEntity<PaginationResponse<List<AwardLetterModel>>> getAwardLetters(int page, int size);

    ResponseEntity<ApiMessageResponse> updateAwardLetter(Long awardLetterId, AwardLetterRequest awardLetterRequest);

    ResponseEntity<ApiMessageResponse> deleteAwardLetter(Long awardLetterId);

    ResponseEntity<AwardLetterModel> getAwardLetter(Long awardLetterId);

    ResponseEntity<ApiMessageResponse> changeStatus(Long awardLetterId, AwardLetterStatus status);

    ResponseEntity<BooleanValueHolderDTO> doCheckProposalIsExist(Long fiscalYearId, Long proposalId);
}
