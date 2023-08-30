package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.web.dto.TappObjectiveCostDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface TappObjectiveCostService {

    ResponseWithResults createObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO);

    ResponseWithResults updateObjectiveCost(TappObjectiveCostDTO tappObjectiveCostDTO);

    ResponseWithResults getByPcUuid(String pcUuid);

    ResponseEntity<ResponseStatus> deleteRow(String pcUuid);


    List<TappObjectiveCostDTO> getObjectiveCostList();

    TappObjectiveCostDTO getObjectiveCostByPcUuid(String pcUuid);

    TappObjectiveCostDTO getShortInfoByPcUuid(String pcUuid);

    TappObjectiveCostDTO getTappObjectiveCostByPpsCode(String ppsCode);
}
