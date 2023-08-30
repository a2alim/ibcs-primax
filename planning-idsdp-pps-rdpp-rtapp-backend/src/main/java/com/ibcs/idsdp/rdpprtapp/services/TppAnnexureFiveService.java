package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TppAnnexureFive;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TppAnnexureFiveRequest;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TppAnnexureFiveService {
    ResponseWithResults save(TppAnnexureFiveRequest response);

    List<TppAnnexureFive> getListByProConceptUuid(String projectUuid);

    ResponseEntity<ResponseStatus> deleteRow(Long id);

}
