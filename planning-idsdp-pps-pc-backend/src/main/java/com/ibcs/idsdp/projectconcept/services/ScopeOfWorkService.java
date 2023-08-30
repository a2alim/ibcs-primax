package com.ibcs.idsdp.projectconcept.services;

import com.ibcs.idsdp.projectconcept.web.dto.ScopeOfWorkDto;
import com.ibcs.idsdp.projectconcept.web.dto.ScopeOfWorkDtoDetails;

import java.util.List;

public interface ScopeOfWorkService
{
    ScopeOfWorkDto createScopeOfWork(ScopeOfWorkDto scopeOfWorkDto, Long projectSummaryId);

    List<ScopeOfWorkDtoDetails> getScopeOfWorkListByProjectId(Long id);

    ScopeOfWorkDto updateScopeOfWork(ScopeOfWorkDto scopeOfWorkDto, Long projectSummaryId);
}
