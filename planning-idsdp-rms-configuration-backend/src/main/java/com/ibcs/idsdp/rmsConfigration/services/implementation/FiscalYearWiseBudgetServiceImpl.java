package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudget;
import com.ibcs.idsdp.rmsConfigration.model.domain.FiscalYearWiseBudgetArchive;
import com.ibcs.idsdp.rmsConfigration.model.repositories.FiscalYearWiseBudgetArchiveRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.FiscalYearWiseBudgetRepository;
import com.ibcs.idsdp.rmsConfigration.services.FiscalYearWiseBudgetService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.FiscalYearWiseBudgetRequestDto;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.FiscalYearWiseBudgetResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;


@Service
@Transactional
public class FiscalYearWiseBudgetServiceImpl extends BaseService<FiscalYearWiseBudget, FiscalYearWiseBudgetRequestDto, FiscalYearWiseBudgetResponseDto> implements FiscalYearWiseBudgetService {

    private final FiscalYearWiseBudgetRepository fiscalYearWiseBudgetRepository;
    private final FiscalYearWiseBudgetArchiveRepository fiscalYearWiseBudgetArchiveRepository;

    public FiscalYearWiseBudgetServiceImpl(ServiceRepository<FiscalYearWiseBudget> repository, FiscalYearWiseBudgetRepository fiscalYearWiseBudgetRepository, FiscalYearWiseBudgetArchiveRepository fiscalYearWiseBudgetArchiveRepository) {
        super(repository);
        this.fiscalYearWiseBudgetRepository = fiscalYearWiseBudgetRepository;
        this.fiscalYearWiseBudgetArchiveRepository = fiscalYearWiseBudgetArchiveRepository;
    }

    @Override
    public Response<FiscalYearWiseBudgetResponseDto> createFiscalYearWiseBudget(FiscalYearWiseBudgetRequestDto fiscalYearWiseBudgetRequestDto) {
//        Boolean isExists = isExistsBeforeSave("st_fiscal_year_wise_budget", "fiscal_year_id",
//                fiscalYearWiseBudgetRequestDto.getFiscalYearId());

        Optional<FiscalYearWiseBudget> fiscalYearWiseBudgetM = fiscalYearWiseBudgetRepository.findByFiscalYearIdAndIsDeleted(fiscalYearWiseBudgetRequestDto.getFiscalYearId(),false);
        if (!fiscalYearWiseBudgetM.isPresent()) {
            fiscalYearWiseBudgetRequestDto.setRevisionNo(1l);
            return create(fiscalYearWiseBudgetRequestDto);
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<FiscalYearWiseBudgetResponseDto> updateFiscalYearWiseBudget(FiscalYearWiseBudgetRequestDto fiscalYearWiseBudgetRequestDto) {
        Optional<FiscalYearWiseBudget> fiscalYearWiseBudgetM = fiscalYearWiseBudgetRepository.findByFiscalYearIdUpdate(fiscalYearWiseBudgetRequestDto.getFiscalYearId(),fiscalYearWiseBudgetRequestDto.getId());
        if (!fiscalYearWiseBudgetM.isPresent()){
           Long newRev= fiscalYearWiseBudgetRequestDto.getRevisionNo();

            FiscalYearWiseBudget fyb= fiscalYearWiseBudgetRepository.findById(fiscalYearWiseBudgetRequestDto.getId()).get();
            FiscalYearWiseBudgetArchive ba=new FiscalYearWiseBudgetArchive();
            ba.setOldId(fyb.getId());
            ba.setCreatedBy(fyb.getCreatedBy());
            ba.setCreatedOn(fyb.getCreatedOn());
            ba.setIsDeleted(fyb.getIsDeleted());
            ba.setUpdatedBy(fyb.getUpdatedBy());
            ba.setUpdatedOn(LocalDate.now());
            ba.setUuid(fyb.getUuid());
            ba.setActive(fyb.getActive());
            ba.setFiscalYearId(fyb.getFiscalYearId());
            ba.setRevisionNo(newRev);
            ba.setTotalAllocatedBudgetAmount(fyb.getTotalAllocatedBudgetAmount());

            fiscalYearWiseBudgetArchiveRepository.save(ba);

            fiscalYearWiseBudgetRequestDto.setRevisionNo(newRev+1l);
            return update(fiscalYearWiseBudgetRequestDto);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<FiscalYearWiseBudget> findAllByActive(boolean isDeleted, boolean isActive) {
        Response<FiscalYearWiseBudget> response = new Response();
        List<FiscalYearWiseBudget> list = fiscalYearWiseBudgetRepository.findAllByIsDeletedAndActive(isDeleted, isActive);
        if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
            response.setItems(list);
            return getSuccessResponse("Data Found!", response);
        }
        return getErrorResponse("Data Not Found!");
    }

//    @Override
//    public Response<FiscalResponseDto> createFiscalYear(FiscalRequestDto fiscalRequestDto) {
//        Boolean isExists = isExistsBeforeSave("st_fiscal_year", "fiscal_year",
//                fiscalRequestDto.getFiscalYear());
//
//        if (!isExists) {
//            return create(fiscalRequestDto);
//        }
//
//        return getErrorResponse("Already Exist!.");
//    }
//
//    @Override
//    public Response<FiscalResponseDto> updateFiscalYear(FiscalRequestDto fiscalRequestDto) {
//        Boolean isExists = isExistsBeforeUpdate("st_fiscal_year", "fiscal_year",
//                fiscalRequestDto.getId(), fiscalRequestDto.getFiscalYear());
//
//        if (!isExists) {
//            return update(fiscalRequestDto);
//        }
//
//        return getErrorResponse("Already Exist!.");
//    }
//
//    @Override
//    public Response<FiscalYear> findAllByActive(boolean isDeleted, boolean isActive) {
//
//        Response<FiscalYear> response = new Response();
//        List<FiscalYear> list = fiscalYearRepository.findAllByIsDeletedAndActive(isDeleted, isActive);
//        if (!CollectionUtils.isEmpty(list) && list.size() > 0) {
//            response.setItems(list);
//            return getSuccessResponse("Data Found!", response);
//        }
//        return getErrorResponse("Data Not Found!");
//    }
}
