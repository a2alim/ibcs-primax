package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.SubSectorConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SubSector;
import com.ibcs.idsdp.idsdpconfigration.services.SubSectorService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SubSectorRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SubSectorResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Optional;

@RestApiController
@RequestMapping(SubSectorConstant.subSector)
public class SubSectorController extends BaseController<SubSector, SubSectorRequest> {

    private final SubSectorService subSectorService;

    public SubSectorController(BaseService<SubSector, SubSectorRequest> baseService, SubSectorService subSectorService) {
        super(baseService);
        this.subSectorService = subSectorService;
    }

    /**
     * Get active sub sector
     */
    @GetMapping(SubSectorConstant.GET_ACTIVE_SUB_SECTOR)
    public ResponseEntity<List<SubSectorResponse>> getActiveSector() {
        return subSectorService.getActiveSubSector();
    }

    /**
     * For create sub sector
     * @param subSectorRequest
     * @return subSectorRequest
     */
    @Override
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public SubSectorRequest create(@RequestBody SubSectorRequest subSectorRequest) {
        subSectorRequest.setCode(subSectorService.generateCode(subSectorRequest.getSubSectorNameEn()));
        return super.create(subSectorRequest);
    }

    /**
     * For get sub sector by sector id
     * @param sectorId
     * @return sectorId
     */
    @GetMapping(path= SubSectorConstant.GET_BY_SECTOR_ID + "/{sectorId}", produces = "application/json")
    public List<SubSectorRequest> getBySectorId(@PathVariable("sectorId") long sectorId) {
        return subSectorService.getBySectorId(sectorId);
    }

    @GetMapping(path= SubSectorConstant.GET_BY_SUB_SECTOR_NAME_EN + "/{subSectorNameEn}" , produces = "application/json")
    public Optional<SubSectorRequest> getBySectorNameEn(@PathVariable("subSectorNameEn") String subSectorNameEn) {
        return subSectorService.getBySubSectorNameEn(subSectorNameEn);
    }

    @GetMapping(path= SubSectorConstant.GET_BY_SUB_SECTOR_CODE + "/{subSectorCode}" , produces = "application/json")
    public Optional<SubSectorRequest> getBySectorCode(@PathVariable("subSectorCode") String subSectorCode) {
        return subSectorService.getBySubSectorCode(subSectorCode);
    }
}
