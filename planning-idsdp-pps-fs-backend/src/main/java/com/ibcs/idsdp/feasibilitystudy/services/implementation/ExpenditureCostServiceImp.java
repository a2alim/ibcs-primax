package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ExpenditureCost;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.ExpenditureCostRepository;
import com.ibcs.idsdp.feasibilitystudy.services.ExpenditureCostService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ExpenditureCostDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ExpenditureCostRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ExpenditureCostServiceImp extends BaseService<ExpenditureCost, ExpenditureCostDTO> implements ExpenditureCostService {

    private final ExpenditureCostRepository expenditureCostRepository;

    public ExpenditureCostServiceImp(ExpenditureCostRepository expenditureCostRepository) {
        super(expenditureCostRepository);
        this.expenditureCostRepository = expenditureCostRepository;
    }

    /**
     * For create Expenditure cost
     * @param expenditureCost
     */
    @Override
    protected ExpenditureCostDTO convertForRead(ExpenditureCost expenditureCost) {
        ExpenditureCostDTO expenditureCostDTO =  super.convertForRead(expenditureCost);
        expenditureCostDTO.setDpaDpAmount(expenditureCost.getDpaDpAmount());
        return expenditureCostDTO;
    }

    /**
     * For get Expenditure cost
     * @param expenditureCostDTO
     */
    @Override
    protected ExpenditureCost convertForCreate(ExpenditureCostDTO expenditureCostDTO) {
        ExpenditureCost e = super.convertForCreate(expenditureCostDTO);
        e.setDpaDpAmount(expenditureCostDTO.getDpaDpAmount());
        return e;
    }

    /**
     * For get Expenditure cost
     * @param request
     */
    @Override
    public Page<ExpenditureCostDTO> getExpenditureCostByFspMasterId(ExpenditureCostRequest request) {
        Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<ExpenditureCost> ePage = expenditureCostRepository.findAllByFspMasterIdAndIsDeletedOrderByIdDesc(request.getFspMasterId(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }


    @Override
    public List<ExpenditureCost> getByPsMasterId(Long id) {
        List<ExpenditureCost> allByFspMasterIdAndIsDeleted = expenditureCostRepository.findAllByFspMasterIdAndIsDeleted(id, false);
        return allByFspMasterIdAndIsDeleted;
    }
}
