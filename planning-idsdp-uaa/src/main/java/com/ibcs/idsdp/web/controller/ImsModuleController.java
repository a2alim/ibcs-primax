package com.ibcs.idsdp.web.controller;

import com.ibcs.idsdp.annotations.ApiController;
import com.ibcs.idsdp.constants.ApiAccessConstants;
import com.ibcs.idsdp.constants.ImsModuleConstants;
import com.ibcs.idsdp.model.domain.ApiEndpoints;
import com.ibcs.idsdp.model.domain.ImsModule;
import com.ibcs.idsdp.services.BaseService;
import com.ibcs.idsdp.services.ImsModuleService;
import com.ibcs.idsdp.web.dto.ImsModuleDTO;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;


@ApiController
@RequestMapping(ImsModuleConstants.IMS_MODULE_ENDPOINT)
public class ImsModuleController extends BaseController<ImsModule, ImsModuleDTO> {

    private final ImsModuleService imsModuleService;

    public ImsModuleController(BaseService<ImsModule, ImsModuleDTO> baseService, ImsModuleService imsModuleService) {
        super(baseService);
        this.imsModuleService = imsModuleService;
    }

    @GetMapping(path= ImsModuleConstants.GET_ACTIVE_LIST, produces = "application/json")
    public @ResponseBody List<ImsModuleDTO> getActiveList() {
        return imsModuleService.getActiveList();
    }

    @GetMapping(path= ImsModuleConstants.GET_DEVELOPMENT_MODULE_LIST, produces = "application/json")
    public @ResponseBody List<ImsModuleDTO> getDevelopmentModuleList() {
        return imsModuleService.getDevelopmentModuleList();
    }

    @GetMapping(ImsModuleConstants.GET_ALL_MODULE)
    public Page<ImsModule> getByPageable(@RequestParam(name = "page", defaultValue = "0") int page, @RequestParam(name = "size", defaultValue = "5") int size) {
        return imsModuleService.findAllByIsDeleteAndIsActive(page, size);
    }

    @PostMapping(value = ImsModuleConstants.APPLY_PAGE_FILTER)
    public Page<ImsModule> applyFilter(@RequestBody SearchWithPageableRequest request) {
        return imsModuleService.findAllByPageable(request);
    }

}
