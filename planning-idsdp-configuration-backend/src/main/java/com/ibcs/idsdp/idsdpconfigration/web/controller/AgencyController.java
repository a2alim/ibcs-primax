package com.ibcs.idsdp.idsdpconfigration.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.AgencyResponseDTO;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.idsdpconfigration.constants.AgencyConstant;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Agency;
import com.ibcs.idsdp.idsdpconfigration.services.AgencyService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.AgencyDTO;
import org.springframework.data.domain.Page;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.sql.SQLException;
import java.util.List;

@RestApiController
@RequestMapping(AgencyConstant.AGENCY)
public class AgencyController extends BaseController<Agency, AgencyDTO> {

    private final AgencyService agencyService;

    public AgencyController(BaseService<Agency, AgencyDTO> baseService, AgencyService agencyService) {
        super(baseService);
        this.agencyService = agencyService;
    }

    /**
     * For Getting All Active Agency
     *
     * @param requestBodyDTO
     * @return
     */
    @PostMapping(path = AgencyConstant.GET_ACTIVE_AGENCY, produces = "application/json")
    public Page<AgencyDTO> getActiveAgency(@RequestBody PageableRequestBodyDTO requestBodyDTO) {
        return agencyService.getActiveAgency(requestBodyDTO);
    }

    /**
     * For getting all active agency by ministry division Id
     *
     * @param ministryDivisionId
     * @return
     */
    @GetMapping(path = AgencyConstant.GET_ALL_ACTIVE_AGENCY_BY_MINISTRY_ID  + "/{ministryDivisionId}", produces = "application/json")
    public ResponseEntity<List<AgencyDTO>> getByMinistryDivisionId(@PathVariable("ministryDivisionId") Long ministryDivisionId) {
        return agencyService.getByMinistryDivisionId(ministryDivisionId);
    }

    @GetMapping(path = AgencyConstant.GET_BY_NAME_EN  + "/{nameEn}", produces = "application/json")
    public AgencyDTO getByNameEn(@PathVariable("nameEn") String nameEn) {
        return agencyService.getByNameEn(nameEn);
    }

    @GetMapping(path = AgencyConstant.GET_ACTIVE_DATA, produces = "application/json")
    public List<AgencyResponseDTO> getActiveData() throws SQLException {
        return agencyService.getActiveData();
    }

    @GetMapping(path = AgencyConstant.GET_BY_CODE  + "/{code}", produces = "application/json")
    public AgencyDTO getByCode(@PathVariable("code") String code) {
        return agencyService.getByCode(code);
    }
}
