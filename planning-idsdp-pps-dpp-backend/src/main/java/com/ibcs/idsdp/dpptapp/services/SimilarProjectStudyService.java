package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.dpptapp.web.dto.SimilarProjectStudyDto;
import com.ibcs.idsdp.dpptapp.web.dto.request.SimilarProjectStudyRequest;

import java.util.List;

public interface SimilarProjectStudyService {
     SimilarProjectStudyRequest saveSimilarProjectStudy(SimilarProjectStudyRequest similarProjectStudyRequest);

    ResponseWithResults getByIsMajorItem(Boolean major);

     ResponseWithResults getSimilarStudyByPcUuid(String pcUuid);

     SimilarProjectStudyDto updateSimilarProjectStudy(SimilarProjectStudyDto request, String pcUuid);


}
