package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.DataDependencyService;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYear;
import com.ibcs.idsdp.rmsConfigration.model.repositories.FiscalYearRepository;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.annotation.PostConstruct;
import javax.transaction.Transactional;
import java.util.List;


@Service
@Transactional
public class FiscalYearServiceImpl extends BaseService<FiscalYear, FiscalRequestDto, FiscalResponseDto> implements FiscalYearService {

    private final FiscalYearRepository fiscalYearRepository;
    @Autowired
    private DataDependencyService dataDependencyService;

    protected FiscalYearServiceImpl(ServiceRepository<FiscalYear> repository, FiscalYearRepository fiscalYearRepository) {
        super(repository);
        this.fiscalYearRepository = fiscalYearRepository;
    }

    @Override
    public Response<FiscalResponseDto> createFiscalYear(FiscalRequestDto fiscalRequestDto) {
        Boolean isExists = isExistsBeforeSave("st_fiscal_year", "fiscal_year",
                fiscalRequestDto.getFiscalYear());

        if (!isExists) {
            return create(fiscalRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<FiscalResponseDto> updateFiscalYear(FiscalRequestDto fiscalRequestDto) {
        Boolean isExists = isExistsBeforeUpdate("st_fiscal_year", "fiscal_year",
                fiscalRequestDto.getId(), fiscalRequestDto.getFiscalYear());

        if (!isExists) {
            return update(fiscalRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<FiscalYear> findAllByActive(boolean isDeleted) {

        Response<FiscalYear> response = new Response();
        List<FiscalYear> list = fiscalYearRepository.findAllByIsDeleted(isDeleted);
        if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
            response.setItems(list);
            return getSuccessResponse("Data Found!", response);
        }
        return getErrorResponse("Data Not Found!");
    }

    @Override
    @PostConstruct
    public void isDeleletable() {

        List<String> table = dataDependencyService.getfilteredTable("fiscal_year");
       boolean response= dataDependencyService.isSafeForDelete(table,"st_fiscal_year_id",45l);
        System.out.println("is safe for delete? : "+response);



    }
}
