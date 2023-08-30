package com.ibcs.idsdp.dpptapp.services.implementation;


import com.ibcs.idsdp.common.config.HelperComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTotal;
import com.ibcs.idsdp.dpptapp.model.domain.DppFiscalYear;
import com.ibcs.idsdp.dpptapp.model.repositories.DppAnnualPhasingCostTabDetailsRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppFiscalYearRepository;
import com.ibcs.idsdp.dpptapp.services.DppFiscalYearService;
import com.ibcs.idsdp.dpptapp.web.dto.DppFiscalYearDTO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class DppFiscalYearServiceImp extends BaseService<DppFiscalYear, DppFiscalYearDTO> implements DppFiscalYearService {

    private final DppFiscalYearRepository repository;
    private final DppAnnualPhasingCostTotalServiceImp dppAnnualPhasingCostTotalServiceImp;
    private final DppAnnualPhasingCostTabDetailsRepository dppAnnualPhasingCostTabDetailsRepository;
    private final HelperComponent helperComponent;

    public DppFiscalYearServiceImp(DppFiscalYearRepository repository,
                                   DppAnnualPhasingCostTotalServiceImp dppAnnualPhasingCostTotalServiceImp,
                                   DppAnnualPhasingCostTabDetailsRepository dppAnnualPhasingCostTabDetailsRepository,
                                   HelperComponent helperComponent) {
        super(repository);
        this.repository = repository;
        this.dppAnnualPhasingCostTotalServiceImp = dppAnnualPhasingCostTotalServiceImp;
        this.dppAnnualPhasingCostTabDetailsRepository = dppAnnualPhasingCostTabDetailsRepository;
        this.helperComponent = helperComponent;
    }

    @Override
    protected DppFiscalYearDTO convertForRead(DppFiscalYear dppFiscalYear) {
        DppFiscalYearDTO dto = super.convertForRead(dppFiscalYear);
        dto.setDppAnnualPhasingCostTabDetailsId(dppFiscalYear.getDppAnnualPhasingCostTabDetails().getId());
        if (dppFiscalYear.getDppAnnualPhasingCostTotal() != null)
            dto.setDppAnnualPhasingCostTotalDTO(dppAnnualPhasingCostTotalServiceImp.getById(dppFiscalYear.getDppAnnualPhasingCostTotal().getId()));
        return dto;
    }

    @Override
    protected DppFiscalYear convertForCreate(DppFiscalYearDTO dppFiscalYearDTO) {
        DppFiscalYear dppFiscalYear = super.convertForCreate(dppFiscalYearDTO);
        DppAnnualPhasingCostTabDetails dppAnnualPhasingCostTabDetails = dppAnnualPhasingCostTabDetailsRepository.findByIdAndIsDeleted(dppFiscalYearDTO.getDppAnnualPhasingCostTabDetailsId(), false).get();
        dppFiscalYear.setDppAnnualPhasingCostTabDetails(dppAnnualPhasingCostTabDetails);
        if (!dppAnnualPhasingCostTabDetails.getDppAnnualPhasingCost().getComponentName().equals(DppAnnualPhasing.Contingency))
            dppFiscalYear.setDppAnnualPhasingCostTotal(new ModelMapper().map(dppFiscalYearDTO.getDppAnnualPhasingCostTotalDTO(), DppAnnualPhasingCostTotal.class));
        return dppFiscalYear;
    }

    @Override
    protected void convertForUpdate(DppFiscalYearDTO dppFiscalYearDTO, DppFiscalYear dppFiscalYear) {
        dppFiscalYear.setDppAnnualPhasingCostTabDetails(dppAnnualPhasingCostTabDetailsRepository.findByIdAndIsDeleted(dppFiscalYearDTO.getDppAnnualPhasingCostTabDetailsId(), false).get());
        super.convertForUpdate(dppFiscalYearDTO, dppFiscalYear);
    }

    @Override
    public List<DppFiscalYearDTO> getByDppAnnualPhasingCostTabDetailsId(Long id) {
        return convertForRead(repository.findByDppAnnualPhasingCostTabDetailsIdAndIsDeleted(id, false));
    }

    @Override
    public List<DppFiscalYearDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing) {
        return convertForRead(repository.getByProjectConceptIdAndComponentName(conceptId, dppAnnualPhasing.ordinal()));
    }
}


