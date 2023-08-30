package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.VisitPlanDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.VisitPlanRequest;
import org.springframework.data.domain.Page;

public interface VisitPlanService {
    Page<VisitPlanDTO> getVisitPlanByFspMasterId(VisitPlanRequest request);
}
