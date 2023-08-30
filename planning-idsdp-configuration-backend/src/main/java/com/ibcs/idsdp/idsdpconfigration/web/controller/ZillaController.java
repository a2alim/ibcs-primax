package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.ZillaConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Zilla;
import com.ibcs.idsdp.idsdpconfigration.services.ZillaService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.ZillaRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ZillaConstant.ZILLA)
public class ZillaController extends BaseController<Zilla, ZillaRequest> {

    private final ZillaService zillaService;

    public ZillaController(BaseService<Zilla, ZillaRequest> baseService, ZillaService zillaService) {
        super(baseService);
        this.zillaService = zillaService;
    }

    /**
     * Get Active Zilla
     * @return
     */
    @GetMapping(ZillaConstant.GET_ACTIVE_ZILLA)
    public ResponseEntity<List<ZillaRequest>> getActiveZilla() {
        return zillaService.getActiveZilla();
    }

    @GetMapping(ZillaConstant.GET_BY_DIVISION_ID +"{divisionId}")
    public List<ZillaRequest> getByDivisionId(@PathVariable Long divisionId) {
        return zillaService.getByDivisionId(divisionId);
    }

    @GetMapping(ZillaConstant.GET_BY_DIVISION_GEO_CODE +"{divisionGeoCode}")
    public List<ZillaRequest> getByDivisionGeoCode(@PathVariable String divisionGeoCode) {
        return zillaService.getByDivisionGeoCode(divisionGeoCode);
    }

    /**
     * create
     * @param zillaRequest
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public ZillaRequest create(@RequestBody ZillaRequest zillaRequest) {
        zillaRequest.setCode(zillaService.generateCodeNumber(zillaRequest.getNameEn()));
        return super.create(zillaRequest);
    }

    /**
     * Get By Division Ids
     * @param requestBodyDTO
     * @return
     */
    @PostMapping(path = ZillaConstant.GET_BY_DIVISION_ID_SET, produces = "application/json")
    public List<ZillaRequest> getByDivisionIds(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
        return zillaService.getByDivisionIds(requestBodyDTO.getIds());
    }
}
