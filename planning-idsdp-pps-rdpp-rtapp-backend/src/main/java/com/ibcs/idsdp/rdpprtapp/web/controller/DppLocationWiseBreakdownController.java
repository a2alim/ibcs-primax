package com.ibcs.idsdp.rdpprtapp.web.controller;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.rdpprtapp.constants.DppLocationWiseBreakdownConstant;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLocationWiseBreakdown;
import com.ibcs.idsdp.rdpprtapp.services.DppLocationWiseBreakdownService;
import com.ibcs.idsdp.rdpprtapp.web.dto.DppLocationWiseBreakdownDTO;
import org.springframework.http.ResponseEntity;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(DppLocationWiseBreakdownConstant.DDP_LOCATION_WISE_COST_BREAKDOWN)
public class DppLocationWiseBreakdownController extends BaseController<DppLocationWiseBreakdown, DppLocationWiseBreakdownDTO> {

    private final DppLocationWiseBreakdownService service;

    public DppLocationWiseBreakdownController(BaseService<DppLocationWiseBreakdown, DppLocationWiseBreakdownDTO> baseService, DppLocationWiseBreakdownService service) {
        super(baseService);
        this.service = service;
    }

    @Transactional
    @PostMapping(path= DppLocationWiseBreakdownConstant.CREATE_LIST, produces = "application/json")
    public @ResponseBody
    ResponseEntity<List<DppLocationWiseBreakdownDTO>> createList(@RequestBody List<DppLocationWiseBreakdownDTO> d) {
        return service.createList(d);
    }

    @Transactional
    @PostMapping(path= DppLocationWiseBreakdownConstant.UPDATE_LIST, produces = "application/json")
    public @ResponseBody
    ResponseEntity<List<DppLocationWiseBreakdownDTO>> updateList(@RequestBody List<DppLocationWiseBreakdownDTO> d) {
        return service.updateList(d);
    }

    @GetMapping(path= DppLocationWiseBreakdownConstant.GET_BY_PROJECT_CONCEPT_MASTER_ID + "/{projectConceptMasterId}", produces = "application/json")
    public @ResponseBody
    ResponseEntity<List<DppLocationWiseBreakdownDTO>> getByProjectConceptMasterId(@PathVariable Long projectConceptMasterId) {
        return service.getByProjectConceptMasterId(projectConceptMasterId);
    }
}
