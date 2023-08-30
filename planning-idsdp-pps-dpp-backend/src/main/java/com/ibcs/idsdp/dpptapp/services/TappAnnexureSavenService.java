package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.TppAnnexureSaven;
import com.ibcs.idsdp.dpptapp.web.dto.TppAnnexureSavenDTO;
import com.ibcs.idsdp.dpptapp.web.dto.request.TppAnnexureSavenRequest;
import org.springframework.web.bind.annotation.PathVariable;

public interface TappAnnexureSavenService {

    /**
     * For create tapp annexure vii records
     * @param tppAnnexureSavenRequest
     * @return
     */
    TppAnnexureSavenDTO save(TppAnnexureSavenRequest tppAnnexureSavenRequest);


    /**
     * For get first row records of tapp annexure vii
     * @return
     */
    //TppAnnexureSaven getFirstRowData ();

    ResponseWithResults getFirstRowData(@PathVariable String proConcept_uuid);
}
