package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.SectorConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Sector;
import com.ibcs.idsdp.idsdpconfigration.services.SectorService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SectorRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(SectorConstant.sector)
public class SectorController extends BaseController<Sector, SectorRequest> {

    private final SectorService sectorService;

    @Autowired
    public SectorController(BaseService<Sector, SectorRequest> baseService, SectorService sectorService) {
        super(baseService);
        this.sectorService = sectorService;
    }

    /**
     * For get active sector
     */
    @GetMapping(SectorConstant.GET_ACTIVE_SECTOR)
    public ResponseEntity<List<SectorResponse>> getActiveSector() {
        return sectorService.getActiveSector();
    }

    /**
     * For create sector
     * @param sectorRequest
     * @return sectorRequest
     */
    @Override
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public SectorRequest create(@RequestBody SectorRequest sectorRequest) {
        sectorRequest.setCode(sectorService.generateCode(sectorRequest.getSectorNameEn()));
        return super.create(sectorRequest);
    }

    /**
     *  Get all by sectorDivisionId
     * @param sectorDivisionId
     * @return
     */
    @GetMapping(path= SectorConstant.GET_BY_SECTOR_DIVISION_ID + "/{sectorDivisionId}" , produces = "application/json")
    public List<SectorRequest> getBySectorDivisionId(@PathVariable("sectorDivisionId") long sectorDivisionId) {
        return sectorService.getBySectorDivisionId(sectorDivisionId);
    }
}
