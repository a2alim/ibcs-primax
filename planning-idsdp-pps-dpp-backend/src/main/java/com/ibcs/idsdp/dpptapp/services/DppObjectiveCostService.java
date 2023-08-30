package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.web.dto.AgencyDashboardDTO;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.FsLinkWithDto;
import org.springframework.http.ResponseEntity;

import java.util.List;
import java.util.Set;

public interface DppObjectiveCostService {

    DppObjectiveCostDTO createObjectiveCost(DppObjectiveCostDTO dppObjectiveCostDTO);

    DppObjectiveCostDTO updateObjectiveCost(DppObjectiveCostDTO dppObjectiveCostDTO);

    DppObjectiveCost getObjectiveCostByPcuuid(String pcuuid);

    ResponseWithResults getObjectivesAndCost(String pcUuid);

    ResponseEntity<ResponseStatus> deleteDevPartnerRow(String rowUuid);


    List<DppObjectiveCostDTO> getObjectiveCostList();

    DppObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid);

    AgencyDashboardDTO getAllStagesByPcIds(Set<Long> ids);

    ResponseStatus linkFsReportWithDpp(FsLinkWithDto fsLinkWithDto);

    DppObjectiveCostDTO getDppObjectiveCostByPpsCode(String ppsCode);

    DppObjectiveCostDTO getShortInfoByPcUuid(String pcUuid);
}
