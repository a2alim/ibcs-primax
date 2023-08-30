package com.ibcs.idsdp.feasibilitystudy.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.feasibilitystudy.constants.VendorManagementConstant;
import com.ibcs.idsdp.feasibilitystudy.model.domain.VendorManagement;
import com.ibcs.idsdp.feasibilitystudy.services.VendorManagementService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.VendorManagementDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.VendorManagementRequest;
import org.springframework.data.domain.Page;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

@RestApiController
@RequestMapping(VendorManagementConstant.VENDOR_MANAGEMENT)
public class VendorManagementController extends BaseController<VendorManagement, VendorManagementDTO> {
    private final VendorManagementService vendorManagementService;

    public VendorManagementController(BaseService<VendorManagement, VendorManagementDTO> baseService, VendorManagementService vendorManagementService) {
        super(baseService);
        this.vendorManagementService = vendorManagementService;
    }

    @PostMapping(path = VendorManagementConstant.GET_VENDOR_MANAGEMENT_LIST, produces = "application/json")
    public Page<VendorManagementDTO> getVendorManagementByFspMasterId(@RequestBody VendorManagementRequest request) {
        return vendorManagementService.getVendorManagementByFspMasterId(request);
    }
}
