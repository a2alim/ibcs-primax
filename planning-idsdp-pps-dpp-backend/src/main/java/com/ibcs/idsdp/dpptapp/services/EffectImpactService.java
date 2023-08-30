package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.model.domain.EffectImpact;
import com.ibcs.idsdp.dpptapp.web.dto.request.EffectImpactRequest;
import com.ibcs.idsdp.dpptapp.web.dto.response.PlisProjectResponseDTO;

public interface EffectImpactService {

    public EffectImpact saveEffectImpact(EffectImpactRequest effectImpactRequest);

    EffectImpact getEffectImpact(Long effectImpactId);

    Boolean updateEffectImpact(EffectImpact effectImpact);

     EffectImpact getEffectImpact(String projectId);

     EffectImpact updateEffectImpact(EffectImpactRequest effectImpactRequest, String id);

    PlisProjectResponseDTO sendProjectDataToPlis(String pcUuid);
}
