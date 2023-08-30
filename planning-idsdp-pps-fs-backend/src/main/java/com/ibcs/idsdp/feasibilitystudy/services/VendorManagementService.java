package com.ibcs.idsdp.feasibilitystudy.services;

import com.ibcs.idsdp.feasibilitystudy.web.dto.VendorManagementDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.VendorManagementRequest;
import org.springframework.data.domain.Page;

public interface VendorManagementService {
    Page<VendorManagementDTO> getVendorManagementByFspMasterId(VendorManagementRequest request);
}
