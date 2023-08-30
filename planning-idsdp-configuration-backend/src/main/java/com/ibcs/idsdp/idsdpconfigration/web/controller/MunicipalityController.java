package com.ibcs.idsdp.idsdpconfigration.web.controller;


import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.MunicipalityConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Municipality;
import com.ibcs.idsdp.idsdpconfigration.services.MunicipalityService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.MunicipalityRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(MunicipalityConstant.MUNICIPALITY)
public class MunicipalityController extends BaseController<Municipality, MunicipalityRequest> {

    private final MunicipalityService municipalityService;

    public MunicipalityController(BaseService<Municipality, MunicipalityRequest> service, MunicipalityService municipalityService) {
        super(service);
        this.municipalityService = municipalityService;
    }

    /*
     * GET ALL ACTIVE MUNICIPALITY
     * @return List<MunicipalityRequest>
     */
    @GetMapping(MunicipalityConstant.GET_ALL_ACTIVE_MUNICIPALITY)
    public ResponseEntity<List<MunicipalityRequest>> getActiveMunicipality() {
        return municipalityService.getActiveMunicipality();
    }

    /*
     * CREATE for Municipality
     * @param municipalityRequest
     * @return MunicipalityRequest
     */

    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public MunicipalityRequest create(@RequestBody MunicipalityRequest municipalityRequest) {
        municipalityRequest.setCode(municipalityService.generateCodeNumber(municipalityRequest.getNameEn()));
        return super.create(municipalityRequest);
    }

    /*
     * GET_BY UPAZILLA ID_SET
     * @param requestBodyDTO
     * @return List<MunicipalityRequest>
     */

    @PostMapping(path = MunicipalityConstant.GET_BY_UPAZILA_ID_SET, produces = "application/json")
    public List<MunicipalityRequest> create(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
        return municipalityService.getMunicipalityByUpazilaIds(requestBodyDTO.getIds());
    }


}
