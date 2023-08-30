package com.ibcs.idsdp.rdpprtapp.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappAnnualPhasingCostTabDetails;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappAnnualPhasingCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.TappAnnualPhasingCostTabDetailsRepository;
import com.ibcs.idsdp.rdpprtapp.services.TappAnnualPhasingCostTabDetailsService;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappAnnualPhasingCostTabDetailsDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class TappAnnualPhasingCostTabDetailsServiceImp extends BaseService<TappAnnualPhasingCostTabDetails, TappAnnualPhasingCostTabDetailsDTO> implements TappAnnualPhasingCostTabDetailsService {

    private final TappAnnualPhasingCostTabDetailsRepository repository;
    private final TappAnnualPhasingCostRepository tappAnnualPhasingCostRepository;

    public TappAnnualPhasingCostTabDetailsServiceImp(TappAnnualPhasingCostTabDetailsRepository repository,
                                                     TappAnnualPhasingCostRepository tappAnnualPhasingCostRepository) {
        super(repository);
        this.repository = repository;
        this.tappAnnualPhasingCostRepository = tappAnnualPhasingCostRepository;
    }

    @Override
    protected TappAnnualPhasingCostTabDetails convertForCreate(TappAnnualPhasingCostTabDetailsDTO tappAnnualPhasingCostTabDetailsDTO) {
        TappAnnualPhasingCostTabDetails tappAnnualPhasingCostTabDetails = super.convertForCreate(tappAnnualPhasingCostTabDetailsDTO);
        tappAnnualPhasingCostTabDetails.setTappAnnualPhasingCost(tappAnnualPhasingCostRepository.findByIdAndIsDeleted(tappAnnualPhasingCostTabDetailsDTO.getTappAnnualPhasingCostId(), false).get());
        return tappAnnualPhasingCostTabDetails;
    }

    @Override
    protected void convertForUpdate(TappAnnualPhasingCostTabDetailsDTO tappAnnualPhasingCostTabDetailsDTO, TappAnnualPhasingCostTabDetails tappAnnualPhasingCostTabDetails) {
        tappAnnualPhasingCostTabDetails.setTappAnnualPhasingCost(tappAnnualPhasingCostRepository.findByIdAndIsDeleted(tappAnnualPhasingCostTabDetailsDTO.getTappAnnualPhasingCostId(), false).get());
        super.convertForUpdate(tappAnnualPhasingCostTabDetailsDTO, tappAnnualPhasingCostTabDetails);
    }

    @Override
    public List<TappAnnualPhasingCostTabDetailsDTO> getByTappAnnualPhasingCostId(Long id) {
        return convertForRead(repository.findByTappAnnualPhasingCostIdAndIsDeleted(id, false));
    }
}


