package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.model.domain.EffectImpact;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.EffectImpactRequest;

public interface EffectImpactService {

    public EffectImpact saveEffectImpact(EffectImpactRequest effectImpactRequest);

    EffectImpact getEffectImpact(Long effectImpactId);

    Boolean updateEffectImpact(EffectImpact effectImpact);

     EffectImpact getEffectImpact(String projectId);

     EffectImpact updateEffectImpact(EffectImpactRequest effectImpactRequest, String id);
}
