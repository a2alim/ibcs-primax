package com.ibcs.idsdp.trainninginstitute.services;

import java.util.List;

import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import com.ibcs.idsdp.trainninginstitute.enums.ProposalStatus;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.ApiMessageResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.NominatedInstituteResponse;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PaginationResponse;

public interface NominatedInstituteService {
	
    ResponseEntity<ApiMessageResponse> changeShortListStatus(Long id, Boolean shortListStatus);

    ResponseEntity<PaginationResponse<List<NominatedInstituteResponse>>> getNominatedInstitutes(Boolean isShortListed, Long trainingInstituteId,
                                                                                                Integer page, Integer size, Long fiscalYearId);

    ResponseEntity<ApiMessageResponse> changeStatus(Long id, Integer status);
    
    Page<NominatedInstituteResponse> gridList(NominatedInstituteResponse reques);
}
