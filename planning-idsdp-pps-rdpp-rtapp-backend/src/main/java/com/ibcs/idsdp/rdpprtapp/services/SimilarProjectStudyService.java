package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.SimilarProjectStudyDto;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.SimilarProjectStudyRequest;

public interface SimilarProjectStudyService {
     SimilarProjectStudyRequest saveSimilarProjectStudy(SimilarProjectStudyRequest similarProjectStudyRequest);

    ResponseWithResults getByIsMajorItem(Boolean major);

     ResponseWithResults getSimilarStudyByPcUuid(String pcUuid);

     SimilarProjectStudyDto updateSimilarProjectStudy(SimilarProjectStudyDto request, String pcUuid);


}
