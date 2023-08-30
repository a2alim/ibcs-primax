package com.ibcs.idsdp.dpptapp.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.DppAnnualPhasingCostTotal;
import com.ibcs.idsdp.dpptapp.model.repositories.DppAnnualPhasingCostTotalRepository;
import com.ibcs.idsdp.dpptapp.services.DppAnnualPhasingCostTotalService;
import com.ibcs.idsdp.dpptapp.web.dto.DppAnnualPhasingCostTotalDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.FiscalYearWiseData;
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
    public List<DppAnnualPhasingCostTotalDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing) {
        List<DppAnnualPhasingCostTotalDTO> list = convertForRead(repository.getByProjectConceptIdAndComponentName(conceptId, dppAnnualPhasing.ordinal()));
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


