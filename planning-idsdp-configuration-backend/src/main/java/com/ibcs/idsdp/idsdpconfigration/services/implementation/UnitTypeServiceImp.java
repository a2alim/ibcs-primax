package com.ibcs.idsdp.idsdpconfigration.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UnitType;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.UnitTypeRepository;
import com.ibcs.idsdp.idsdpconfigration.services.UnitTypeService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.UnitTypeRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Slf4j
@Service
public class UnitTypeServiceImp extends BaseService<UnitType, UnitTypeRequest> implements UnitTypeService {

    private final UnitTypeRepository unitTypeRepository;
    private final IdGeneratorComponent idGeneratorComponent;

    public UnitTypeServiceImp(UnitTypeRepository unitTypeRepository, IdGeneratorComponent idGeneratorComponent){
        super(unitTypeRepository);
        this.unitTypeRepository = unitTypeRepository;
        this.idGeneratorComponent = idGeneratorComponent;
    }


    @Override
    public Page<UnitTypeRequest> getAllRecords(PageableRequestBodyDTO requestBodyDTO){
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<UnitType> ePage2 = unitTypeRepository.findAllByStatusAndIsDeleted(true, true, pageable);
        return new PageImpl(convertForRead(ePage2.getContent()), pageable, ePage2.getTotalElements());
    }

    @Override
    public String generateCodeNumber(String code) {
        String codeNumber = code.substring(0, 2);
        LocalDate date = LocalDate.now();
        String[] part = date.toString().split("-");
        String year = part[0].substring(2, 4);
        String month = part[1];
        String versionListSize = unitTypeRepository.findAll().size() + 1 + "";
        codeNumber = codeNumber + "-" + month + "-" + year + "-" + versionListSize;
        return codeNumber;
    }
}
