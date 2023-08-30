package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.DivisionConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Division;
import com.ibcs.idsdp.idsdpconfigration.services.DivisionService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.idsdpconfigration.web.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;

import java.util.List;

@RestApiController
@RequestMapping(DivisionConstant.DIVISION)
public class DivisionController extends BaseController<Division, DivisionRequest> {

    private final DivisionService divisionService;

    public DivisionController(BaseService<Division, DivisionRequest> baseService, DivisionService divisionService) {
        super(baseService);
        this.divisionService = divisionService;
    }

    /**
     * getActiveDivision
     * @return
     */
    @GetMapping(DivisionConstant.GET_ACTIVE_DIVISION)
    public ResponseEntity<List<DivisionRequest>> getActiveDivision() {
        return divisionService.getActiveDivision();
    }

    /**
     * Create
     * @param divisionRequest
     * @return
     */
    @PostMapping(path = BaseConstant.CREATE, produces = "application/json")
    public DivisionRequest create(@RequestBody DivisionRequest divisionRequest) {
        divisionRequest.setCode(divisionService.generateCodeNumber(divisionRequest.getNameEn()));
        return super.create(divisionRequest);
    }

    /**
     * Get All Active Division With Zilla Upazilla And Municipalty
     * @return
     */
    @GetMapping(DivisionConstant.GET_DIVISION_WITH_ZILLA_UPAZILLA_MUNICIPALTY)
    public List<DivisionRequest> getAllActiveDivisionWithZillaUpazillaAndMunicipalty() {
        return divisionService.getAllActiveDivisionWithZillaUpazillaAndMunicipalty();
    }

    /**
     * Get All Active Division Zilla Upazilla And Municipalty
     * @return
     */
    @GetMapping(DivisionConstant.GET_ALL_DIVISION_ZILLA_UPAZILLA_MUNICIPALTY)
    public ResponseEntity<DivisionZillaUpazilaMunicipalityResponse> getAllActiveDivisionZillaUpazillaMunicipality() {
        return divisionService.getAllActiveDivisionZillaUpazillaMunicipality();
    }
}
