package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.model.domain.DppAnnexVVI;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAnnexVVIRequest;

public interface DppAnnexVVIService {
    DppAnnexVVI saveAnnexVVI(DppAnnexVVIRequest dppAnnexVVIRequest);

    Boolean update(DppAnnexVVI dppAnnexVVI);

    public DppAnnexVVI getAnnexV_VIByProjectId(String projectId);

    public DppAnnexVVI updateAnnexV_VI(DppAnnexVVIRequest otherDetailsRequest, String id);
}
