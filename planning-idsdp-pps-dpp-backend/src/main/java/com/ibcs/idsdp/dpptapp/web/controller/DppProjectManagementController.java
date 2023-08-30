package com.ibcs.idsdp.dpptapp.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.dpptapp.constants.DppProjectManagementConstant;
import com.ibcs.idsdp.dpptapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.dpptapp.model.domain.DppProjectManagement;
import com.ibcs.idsdp.dpptapp.services.DppProjectManagementService;
import com.ibcs.idsdp.dpptapp.web.dto.DppProjectManagementDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppProjectManagementResponse;
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

    @PutMapping(path = "/updateProManagement/{pcUuid}")
    public DppProjectManagementResponse updatePCM(@RequestBody DppProjectManagementResponse response, @PathVariable String pcUuid){
        return this.dppProjectManagementService.updateProjectManagement(response, pcUuid);
    }
}
