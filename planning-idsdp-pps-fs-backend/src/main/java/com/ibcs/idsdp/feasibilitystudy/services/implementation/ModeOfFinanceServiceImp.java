package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ModeOfFinance;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.ModeOfFianceRepository;
import com.ibcs.idsdp.feasibilitystudy.services.ModeOfFinanceService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ModeOfFinanceDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ModeOfFianceRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Slf4j
@Service
public class ModeOfFinanceServiceImp extends BaseService<ModeOfFinance, ModeOfFinanceDTO> implements ModeOfFinanceService {
    private final ModeOfFianceRepository repository;

    public ModeOfFinanceServiceImp(ModeOfFianceRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    public Page<ModeOfFinanceDTO> getModeOfFinanceByFspMasterId(ModeOfFianceRequest request) {
        Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<ModeOfFinance> ePage = repository.findAllByFspMasterIdAndIsDeletedOrderByIdDesc(request.getFspMasterId(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    @Override
    public List<ModeOfFinance> getModeOfFinanceListByFsMasterId(Long id) {
        List<ModeOfFinance> allByFspMasterIdAndIsDeleted = repository.findAllByFspMasterIdAndIsDeleted(id, false);
        return allByFspMasterIdAndIsDeleted;
    }
}
