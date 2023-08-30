package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.SectorDivisionConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.SectorDivision;
import com.ibcs.idsdp.idsdpconfigration.services.SectorDivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.SectorDivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.SectorDivisionResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(SectorDivisionConstant.sectorDivision)
public class SectorDivisionController extends BaseController<SectorDivision, SectorDivisionRequest> {

    private final SectorDivisionService sectorDivisionService;

    public SectorDivisionController(BaseService<SectorDivision, SectorDivisionRequest> baseService, SectorDivisionService sectorDivisionService) {
        super(baseService);
        this.sectorDivisionService = sectorDivisionService;
    }

    /**
     * For get active sector division
     */
    @GetMapping(SectorDivisionConstant.GET_ACTIVE_SECTOR_DIVISION)
    public ResponseEntity<List<SectorDivisionResponse>> getActiveSectorDivision() {
        return sectorDivisionService.getActiveSectorDivision();
    }

    /**
     * For create sector division
     * @param sectorDivisionDTO
     * @return sector division dto
     */
    @Override
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public SectorDivisionRequest create(@RequestBody SectorDivisionRequest sectorDivisionDTO) {
        sectorDivisionDTO.setCode(sectorDivisionService.generateCode(sectorDivisionDTO.getSectorDivisionNameEn()));
        return super.create(sectorDivisionDTO);
    }


}
