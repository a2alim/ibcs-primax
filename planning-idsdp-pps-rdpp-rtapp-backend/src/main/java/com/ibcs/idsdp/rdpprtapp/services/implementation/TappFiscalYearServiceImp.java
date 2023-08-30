package com.ibcs.idsdp.rdpprtapp.services.implementation;


import com.ibcs.idsdp.common.config.HelperComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappAnnualPhasingCostTotal;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappFiscalYear;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappAnnualPhasingCostTabDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappFiscalYearRepository;
import com.ibcs.idsdp.rdpprtapp.services.TappFiscalYearService;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappFiscalYearDTO;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class TappFiscalYearServiceImp extends BaseService<TappFiscalYear, TappFiscalYearDTO> implements TappFiscalYearService {

    private final TappFiscalYearRepository repository;
    private final TappAnnualPhasingCostTotalServiceImp tappAnnualPhasingCostTotalServiceImp;
    private final TappAnnualPhasingCostTabDetailsRepository tappAnnualPhasingCostTabDetailsRepository;
    private final HelperComponent helperComponent;

    public TappFiscalYearServiceImp(TappFiscalYearRepository repository,
                                    TappAnnualPhasingCostTotalServiceImp tappAnnualPhasingCostTotalServiceImp,
                                    TappAnnualPhasingCostTabDetailsRepository tappAnnualPhasingCostTabDetailsRepository,
                                    HelperComponent helperComponent) {
        super(repository);
        this.repository = repository;
        this.tappAnnualPhasingCostTotalServiceImp = tappAnnualPhasingCostTotalServiceImp;
        this.tappAnnualPhasingCostTabDetailsRepository = tappAnnualPhasingCostTabDetailsRepository;
        this.helperComponent = helperComponent;
    }

    @Override
    protected TappFiscalYearDTO convertForRead(TappFiscalYear tappFiscalYear) {
        TappFiscalYearDTO dto = super.convertForRead(tappFiscalYear);
        dto.setTappAnnualPhasingCostTabDetailsId(tappFiscalYear.getTappAnnualPhasingCostTabDetails().getId());
        if (tappFiscalYear.getTappAnnualPhasingCostTotal() != null)
            dto.setTappAnnualPhasingCostTotalDTO(tappAnnualPhasingCostTotalServiceImp.getById(tappFiscalYear.getTappAnnualPhasingCostTotal().getId()));
        return dto;
    }

    @Override
    protected TappFiscalYear convertForCreate(TappFiscalYearDTO tappFiscalYearDTO) {
        TappFiscalYear tappFiscalYear = super.convertForCreate(tappFiscalYearDTO);
        TappAnnualPhasingCostTabDetails tappAnnualPhasingCostTabDetails = tappAnnualPhasingCostTabDetailsRepository.findByIdAndIsDeleted(tappFiscalYearDTO.getTappAnnualPhasingCostTabDetailsId(), false).get();
        tappFiscalYear.setTappAnnualPhasingCostTabDetails(tappAnnualPhasingCostTabDetails);
        if (!tappAnnualPhasingCostTabDetails.getTappAnnualPhasingCost().getComponentName().equals(DppAnnualPhasing.Contingency))
            tappFiscalYear.setTappAnnualPhasingCostTotal(new ModelMapper().map(tappFiscalYearDTO.getTappAnnualPhasingCostTotalDTO(), TappAnnualPhasingCostTotal.class));
        return tappFiscalYear;
    }

    @Override
    protected void convertForUpdate(TappFiscalYearDTO tappFiscalYearDTO, TappFiscalYear tappFiscalYear) {
        tappFiscalYear.setTappAnnualPhasingCostTabDetails(tappAnnualPhasingCostTabDetailsRepository.findByIdAndIsDeleted(tappFiscalYearDTO.getTappAnnualPhasingCostTabDetailsId(), false).get());
        super.convertForUpdate(tappFiscalYearDTO, tappFiscalYear);
    }

    @Override
    public List<TappFiscalYearDTO> getByTappAnnualPhasingCostTabDetailsId(Long id) {
        return convertForRead(repository.findByTappAnnualPhasingCostTabDetailsIdAndIsDeleted(id, false));
    }

    @Override
    public List<TappFiscalYearDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing) {
        return convertForRead(repository.getByProjectConceptIdAndComponentName(conceptId, dppAnnualPhasing.ordinal()));
    }
}


