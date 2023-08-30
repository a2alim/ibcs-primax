package com.ibcs.idsdp.rdpprtapp.services;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappYearCostSummery;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappYearCostSummeryRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappYearCostSummeryDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Optional;

@Slf4j
@Service
public class TappYearCostSummeryServiceImp extends BaseService<TappYearCostSummery, TappYearCostSummeryDTO> implements TappYearCostSummeryService {

    private final TappYearCostSummeryRepository tappYearCostSummeryRepository;

    public TappYearCostSummeryServiceImp(TappYearCostSummeryRepository tappYearCostSummeryRepository) {
        super(tappYearCostSummeryRepository);
        this.tappYearCostSummeryRepository = tappYearCostSummeryRepository;
    }

    /**
     * @param dto
     * @return
     */
    @Override
    protected TappYearCostSummery convertForCreate(TappYearCostSummeryDTO dto) {
        TappYearCostSummery tappYearCostSummery = super.convertForCreate(dto);
//        tappYearCostSummery.setTappMasterId(tappObjectiveCostRepository.findByIdAndIsDeleted(dppLocationDTO.getDppMasterId(), false).get());
        tappYearCostSummery.setProjectSummeryMasterId(dto.getProjectSummeryMasterId());
        tappYearCostSummery.setStatus(true);
        return tappYearCostSummery;
    }

    @Override
    protected void convertForUpdate(TappYearCostSummeryDTO dto, TappYearCostSummery yearCostSummery) {
        yearCostSummery.setStatus(true);
        yearCostSummery.setIndicateIssues(dto.getIndicateIssues());
        yearCostSummery.setIndicateIssuesNotWork(dto.getIndicateIssuesNotWork());
    }

    /**
     * Get Objective Cost By Pc uuid
     * @param projectSummeryId
     * @return
     */
    @Transactional
    @Override
    public ResponseWithResults getYearCostSummery(Long projectSummeryId) {
        Optional<TappYearCostSummery> optional = tappYearCostSummeryRepository.findByProjectSummeryMasterIdAndIsDeletedAndStatus(projectSummeryId, false, true);
        if(optional.isPresent()) {
            TappYearCostSummery response = optional.get();
            return new ResponseWithResults(1, "Success", response);
        }
        else
        {
            return new ResponseWithResults(0, "Failed", "");
        }

    }
}


