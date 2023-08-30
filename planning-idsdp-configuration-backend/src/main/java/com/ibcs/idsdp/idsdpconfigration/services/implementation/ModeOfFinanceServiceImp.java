package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.MainCofog;
import com.ibcs.idsdp.idsdpconfigration.model.domain.ModeOfFinance;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.ModeOfFinanceRepository;
import com.ibcs.idsdp.idsdpconfigration.services.ModeOfFinanceService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ModeFinanceMoveRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

import static java.lang.Boolean.TRUE;

@Slf4j
@Service
public class ModeOfFinanceServiceImp extends BaseService<ModeOfFinance, ModeOfFinanceDTO> implements ModeOfFinanceService {

    private final ModeOfFinanceRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public ModeOfFinanceServiceImp(ModeOfFinanceRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    // Override Base Service method for converting and arranging data from DTO to Entity for Create
    @Override
    protected ModeOfFinance convertForCreate(ModeOfFinanceDTO modeOfFinanceDTO) {
        ModeOfFinance modeOfFinance = super.convertForCreate(modeOfFinanceDTO);
        modeOfFinance.setCode(idGeneratorComponent.generateCode(modeOfFinanceDTO.getNameEn(), repository.count()));
        // set new orderId
        modeOfFinance.setOrderId(repository.count() + 1);
        return modeOfFinance;
    }

    // Override Base Service method for converting and arranging data from DTO to Entity for Edit
    @Override
    protected void convertForUpdate(ModeOfFinanceDTO modeOfFinanceDTO, ModeOfFinance modeOfFinance) {
        modeOfFinanceDTO.setCode(modeOfFinance.getCode());
        super.convertForUpdate(modeOfFinanceDTO, modeOfFinance);
    }

    // For Getting All Active Mode Of Finance
    @Override
    public Page<ModeOfFinanceDTO> getActiveModeOfFinance(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ModeOfFinance> ePage = repository.findAllByStatusAndIsDeleted(true,false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    // Get all active data orderBy orderId
    @Override
    public Page<ModeOfFinanceDTO> getModeOfFinanceByOrderId(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ModeOfFinance> ePage = repository.findAllByStatusAndIsDeletedOrderByOrderIdAsc(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    // Modify orderId
    @Override
    public void moveModeFinance(ModeFinanceMoveRequest modeFinanceMoveRequest) {
        long count = 1L;
        for (Long id : modeFinanceMoveRequest.getModeFinanceIds()) {
            Optional<ModeOfFinance> modeOfFinanceOptional = repository.findByIdAndIsDeleted(id, false);
            if (modeOfFinanceOptional.isPresent()) {
                ModeOfFinance modeOfFinance = modeOfFinanceOptional.get();
                // set new orderId
                modeOfFinance.setOrderId(count++);
                repository.save(modeOfFinance);
            }
        }
    }

    public ResponseEntity<List<ModeOfFinanceDTO>> getActiveModeFinData(Boolean status, Boolean isDelete){
         return new ResponseEntity(repository.findByStatusAndIsDeleted(status, isDelete), HttpStatus.OK);
    }
}


