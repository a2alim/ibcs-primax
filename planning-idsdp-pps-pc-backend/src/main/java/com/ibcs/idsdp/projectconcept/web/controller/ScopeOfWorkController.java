package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.controller.BaseController;
import com.ibcs.idsdp.config.annotations.RestApiController;
import com.ibcs.idsdp.projectconcept.constants.ScopeOfWorkConstant;
import com.ibcs.idsdp.projectconcept.model.domain.ScopeOfWork;
import com.ibcs.idsdp.projectconcept.services.ScopeOfWorkService;
import com.ibcs.idsdp.projectconcept.web.dto.ScopeOfWorkDto;
import com.ibcs.idsdp.projectconcept.web.dto.ScopeOfWorkDtoDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestApiController
@RequestMapping(ScopeOfWorkConstant.SCOPE_OF_WORK)
public class ScopeOfWorkController extends BaseController<ScopeOfWork, ScopeOfWorkDto> {
    private ScopeOfWorkService scopeOfWorkService;
    public ScopeOfWorkController(BaseService<ScopeOfWork, ScopeOfWorkDto> service, ScopeOfWorkService scopeOfWorkService) {
        super(service);
        this.scopeOfWorkService = scopeOfWorkService;
    }

    /*
     * Create for ScopeOfWorkDto
     * @param scopeOfWorkDto
     * @param projectSummaryId
     * @return ScopeOfWorkDto
     */

    @PostMapping(path = ScopeOfWorkConstant.CREATE, produces = "application/json")
    public ScopeOfWorkDto create(@RequestBody ScopeOfWorkDto scopeOfWorkDto, @PathVariable Long projectSummaryId) {
        return scopeOfWorkService.createScopeOfWork(scopeOfWorkDto, projectSummaryId);
    }

    /*
     * Get list for ScopeOfWork
     * @param projectSummaryId
     * @return List<ScopeOfWorkDtoDetails>
     */

    @GetMapping(path = ScopeOfWorkConstant.GET_SCOPE_OF_WORK_LIST, produces = "application/json")
    public List<ScopeOfWorkDtoDetails> getScopeOfWorkListByProjectId(@PathVariable Long projectSummaryId) {
        return scopeOfWorkService.getScopeOfWorkListByProjectId(projectSummaryId);
    }

    /*
     *
     * @param scopeOfWorkDto
     * @param projectSummaryId
     * @return ScopeOfWorkDto
     */

    @PutMapping(path = ScopeOfWorkConstant.UPDATE, produces = "application/json")
    public ScopeOfWorkDto update( @RequestBody ScopeOfWorkDto scopeOfWorkDto, @PathVariable Long projectSummaryId) {
        return scopeOfWorkService.updateScopeOfWork(scopeOfWorkDto, projectSummaryId);
    }
}
