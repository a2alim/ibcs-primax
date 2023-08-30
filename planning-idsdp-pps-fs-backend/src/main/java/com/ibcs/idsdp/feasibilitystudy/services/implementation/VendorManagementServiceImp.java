package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.VendorManagement;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.VendorManagementRepository;
import com.ibcs.idsdp.feasibilitystudy.services.VendorManagementService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.VendorManagementDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.VendorManagementRequest;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class VendorManagementServiceImp extends BaseService<VendorManagement, VendorManagementDTO> implements VendorManagementService {
    private final VendorManagementRepository repository;

    public VendorManagementServiceImp(VendorManagementRepository repository) {
        super(repository);
        this.repository = repository;
    }

    @Override
    public Page<VendorManagementDTO> getVendorManagementByFspMasterId(VendorManagementRequest request) {
        Pageable pageable = this.getPageable(request.getPageableRequestBodyDTO());
        Page<VendorManagement> ePage = repository.findAllByFspMasterIdAndIsDeletedOrderByIdDesc(request.getFspMasterId(), false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }
}
