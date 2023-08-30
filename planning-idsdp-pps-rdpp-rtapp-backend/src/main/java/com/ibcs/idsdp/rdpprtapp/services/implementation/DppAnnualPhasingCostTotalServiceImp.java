package com.ibcs.idsdp.rdpprtapp.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rdpprtapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppAnnualPhasingCostTotal;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppAnnualPhasingCostTotalRepository;
import com.ibcs.idsdp.rdpprtapp.services.DppAnnualPhasingCostTotalService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppAnnualPhasingCostTotalDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DppAnnualPhasingCostTotalServiceImp extends BaseService<DppAnnualPhasingCostTotal, DppAnnualPhasingCostTotalDTO> implements DppAnnualPhasingCostTotalService {

    private final DppAnnualPhasingCostTotalRepository repository;

    public DppAnnualPhasingCostTotalServiceImp(DppAnnualPhasingCostTotalRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    public List<DppAnnualPhasingCostTotalDTO> getByRdppMasterIdAndComponentName(Long rdppMasterId, DppAnnualPhasing dppAnnualPhasing) {
        List<DppAnnualPhasingCostTotalDTO> list = convertForRead(repository.getByRdppMasterIdAndComponentName(rdppMasterId, dppAnnualPhasing.ordinal()));
        List<DppAnnualPhasingCostTotalDTO> finalList = new ArrayList<>();
        if (!list.isEmpty()) {
            finalList = list.stream()
                    .sorted(Comparator.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
                    .collect(Collectors.toList());
        }
        return finalList;
    }

    @Override
    public DppAnnualPhasingCostTotalDTO getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, DppAnnualPhasing dppAnnualPhasing, String fiscalYear) {
        DppAnnualPhasingCostTotal dppAnnualPhasingCostTotal = repository.getByProjectConceptIdAndComponentNameAndFiscalYear(conceptId, dppAnnualPhasing.ordinal(), fiscalYear);
        if (dppAnnualPhasingCostTotal != null) {
            return convertForRead(dppAnnualPhasingCostTotal);
        }
        return null;
    }
}


