package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppProjectManagementConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppProjectManagement;
import com.ibcs.idsdp.rdpprtapp.services.DppProjectManagementService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppProjectManagementDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.DppProjectManagementResponse;
import org.springframework.web.bind.annotation.*;


@RestApiController
@RequestMapping(DppProjectManagementConstant.PROJECT_MANAGEMENT)
public class DppProjectManagementController extends BaseController<DppProjectManagement, DppProjectManagementDTO> {

    private final DppProjectManagementService dppProjectManagementService;

    public DppProjectManagementController(BaseService<DppProjectManagement, DppProjectManagementDTO> baseService, DppProjectManagementService dppProjectManagementService) {
        super(baseService);
        this.dppProjectManagementService = dppProjectManagementService;
    }

    /**
     * Get By Pcid
     * @param pcUuid
     * @return
     */
    @GetMapping("/getProManagement/{pcUuid}")
    public DppProjectManagementResponse getByPcid(@PathVariable String pcUuid) {
        System.out.println(pcUuid);
        return dppProjectManagementService.getProjectManagementByPcUuid(pcUuid);
    }


    @GetMapping("/getProManagementById/{id}")
    public DppProjectManagementResponse getProjectManagementById(@PathVariable Long id) {
        System.out.println(id);
        return dppProjectManagementService.getProjectManagementById(id);
    }


    @PutMapping(path = "/updateProManagement/{id}")
    public DppProjectManagementResponse updatePCM(@RequestBody DppProjectManagementResponse response, @PathVariable Long id){
        return this.dppProjectManagementService.updateProjectManagement(response, id);
    }
}
