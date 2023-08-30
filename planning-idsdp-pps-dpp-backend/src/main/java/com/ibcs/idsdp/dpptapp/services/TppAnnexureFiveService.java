package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.IdentityResponse;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureFive;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureSaven;
import com.ibcs.idsdp.dpptapp.web.dto.TppAnnexureFiveDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TppAnnexureSavenDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureFiveRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureSavenRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodSaveWithChildRequest;
import com.ibcs.idsdp.dpptapp.web.dto.request.tappAnnexurs.TappAnnexureGoodsRequest;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TppAnnexureFiveService {
    ResponseWithResults save(TppAnnexureFiveRequest response);

    List<TppAnnexureFive> getListByProConceptUuid(String projectUuid);

    ResponseEntity<ResponseStatus> deleteRow(Long id);

}
