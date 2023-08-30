package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.projectconcept.model.domain.ModeOfFinance;
import com.ibcs.idsdp.projectconcept.model.repositories.ModeOfFianceRepository;
import com.ibcs.idsdp.projectconcept.services.ModeOfFinanceService;
import com.ibcs.idsdp.projectconcept.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.projectconcept.web.dto.request.ModeOfFianceRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ModeOfFinanceServiceImp extends BaseService<ModeOfFinance, ModeOfFinanceDTO> implements ModeOfFinanceService {

    private final ModeOfFianceRepository repository;

    public ModeOfFinanceServiceImp(ModeOfFianceRepository repository) {
        super(repository);
        this.repository = repository;
    }

    /**
     * for get ProjectSummary list  By ProjectType
     * @param request
     * @return Page<ModeOfFinanceDTO>
     */
    @Override
    public Page<ModeOfFinanceDTO> getProjectSummaryByProjectType(ModeOfFianceRequest request) {
        Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<ModeOfFinance> ePage = repository.findAllByProjectConceptMasterIdAndIsDeletedOrderByIdDesc(request.getProjectConceptMasterId(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    @Override
    public List<ModeOfFinanceDTO> getProjectSummaryByProjectType(Long projectConceptMasterId) {
        return convertForRead(repository.findAllByProjectConceptMasterIdAndIsDeletedOrderByIdDesc(projectConceptMasterId, false));
    }

}
