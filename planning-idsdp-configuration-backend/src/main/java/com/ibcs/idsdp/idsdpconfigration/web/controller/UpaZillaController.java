package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.UpaZillaConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.UpaZilla;
import com.ibcs.idsdp.idsdpconfigration.services.UpaZillaService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.UpaZillaRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(UpaZillaConstant.UPAZILLA)
public class UpaZillaController extends BaseController<UpaZilla, UpaZillaRequest> {

    private final UpaZillaService upaZillaService;

    public UpaZillaController(BaseService<UpaZilla, UpaZillaRequest> baseService, UpaZillaService upaZillaService) {
        super(baseService);
        this.upaZillaService = upaZillaService;
    }

    /**
     * Get Active UpaZilla
     * @return
     */
    @GetMapping(UpaZillaConstant.GET_ACTIVE_UPAZILLA)
    public ResponseEntity<List<UpaZillaRequest>> getActiveUpaZilla() {
        return upaZillaService.getActiveUpaZilla();
    }


    @GetMapping(UpaZillaConstant.GET_BY_ZILLA_ID +"{zillaId}")
    public List<UpaZillaRequest> getByZillId(@PathVariable Long zillaId) {
        return upaZillaService.getByZillId(zillaId);
    }

    @GetMapping(UpaZillaConstant.GET_BY_ZILLA_GEO_CODE +"{zillaGeoCode}")
    public List<UpaZillaRequest> getByZillaGeoCode(@PathVariable String zillaGeoCode) {
        return upaZillaService.getByZillaGeoCode(zillaGeoCode);
    }

    /**
     * create
     * @param upaZillaRequest
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public UpaZillaRequest create(@RequestBody UpaZillaRequest upaZillaRequest) {
        upaZillaRequest.setCode(upaZillaService.generateCodeNumber(upaZillaRequest.getNameEn()));
        return super.create(upaZillaRequest);
    }

    /**
     * Get By Zilla Id Set
     * @param requestBodyDTO
     * @return
     */
    @PostMapping(path = UpaZillaConstant.GET_BY_ZILLA_ID_SET, produces = "application/json")
    public List<UpaZillaRequest> create(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
        return upaZillaService.getByZillIds(requestBodyDTO.getIds());
    }
}
