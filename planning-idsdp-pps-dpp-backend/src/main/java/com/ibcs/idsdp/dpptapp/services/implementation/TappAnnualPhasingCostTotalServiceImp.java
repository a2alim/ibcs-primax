package com.ibcs.idsdp.dpptapp.services.implementation;


import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.dpptapp.enums.DppAnnualPhasing;
import com.ibcs.idsdp.dpptapp.model.domain.TappAnnualPhasingCostTotal;
import com.ibcs.idsdp.dpptapp.model.repositories.TappAnnualPhasingCostTotalRepository;
import com.ibcs.idsdp.dpptapp.services.TappAnnualPhasingCostTotalService;
import com.ibcs.idsdp.dpptapp.web.dto.TappAnnualPhasingCostTotalDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class TappAnnualPhasingCostTotalServiceImp extends BaseService<TappAnnualPhasingCostTotal, TappAnnualPhasingCostTotalDTO> implements TappAnnualPhasingCostTotalService {

    private final TappAnnualPhasingCostTotalRepository repository;

    public TappAnnualPhasingCostTotalServiceImp(TappAnnualPhasingCostTotalRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    public List<TappAnnualPhasingCostTotalDTO> getByProjectConceptIdAndComponentName(Long conceptId, DppAnnualPhasing dppAnnualPhasing) {
        List<TappAnnualPhasingCostTotalDTO> list = convertForRead(repository.getByProjectConceptIdAndComponentName(conceptId, dppAnnualPhasing.ordinal()));
        List<TappAnnualPhasingCostTotalDTO> finalList = new ArrayList<>();
        if (!list.isEmpty()) {
            finalList = list.stream()
                    .sorted(Comparator.comparing(c -> Integer.parseInt(c.getFiscalYear().substring(c.getFiscalYear().length() - 4))))
                    .collect(Collectors.toList());
        }
        return finalList;
    }

    @Override
    public TappAnnualPhasingCostTotalDTO getByProjectConceptIdAndComponentNameAndFiscalYear(Long conceptId, DppAnnualPhasing dppAnnualPhasing, String fiscalYear) {
        TappAnnualPhasingCostTotal dppAnnualPhasingCostTotal = repository.getByProjectConceptIdAndComponentNameAndFiscalYear(conceptId, dppAnnualPhasing.ordinal(), fiscalYear);
        if (dppAnnualPhasingCostTotal != null) {
            return convertForRead(dppAnnualPhasingCostTotal);
        }
        return null;
    }
}


