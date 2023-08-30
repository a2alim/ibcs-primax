package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudgetArchive;
import com.ibcs.idsdp.rmsConfigration.model.repositories.FiscalYearWiseBudgetRepository;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearWiseBudgetArchiveService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalYearWiseBudgetArchiveRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalYearWiseBudgetArchiveResponseDto;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;


@Service
@Transactional
public class FiscalYearWiseBudgetArchiveServiceImpl extends BaseService<FiscalYearWiseBudgetArchive, FiscalYearWiseBudgetArchiveRequestDto, FiscalYearWiseBudgetArchiveResponseDto> implements FiscalYearWiseBudgetArchiveService {

    private final FiscalYearWiseBudgetRepository fiscalYearWiseBudgetRepository;

    public FiscalYearWiseBudgetArchiveServiceImpl(ServiceRepository<FiscalYearWiseBudgetArchive> repository, FiscalYearWiseBudgetRepository fiscalYearWiseBudgetRepository) {
        super(repository);
        this.fiscalYearWiseBudgetRepository = fiscalYearWiseBudgetRepository;
    }
}
