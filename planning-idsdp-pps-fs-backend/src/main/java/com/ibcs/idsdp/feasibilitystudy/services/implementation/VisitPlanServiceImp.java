package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.VisitPlan;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.VisitPlanRepository;
import com.ibcs.idsdp.feasibilitystudy.services.VisitPlanService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.VisitPlanDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.VisitPlanRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class VisitPlanServiceImp extends BaseService<VisitPlan, VisitPlanDTO> implements VisitPlanService {
    private final VisitPlanRepository repository;

    public VisitPlanServiceImp(VisitPlanRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    public Page<VisitPlanDTO> getVisitPlanByFspMasterId(VisitPlanRequest request) {
        Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<VisitPlan> ePage = repository.findAllByFspMasterIdAndIsDeletedOrderByIdDesc(request.getFspMasterId(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }
}
