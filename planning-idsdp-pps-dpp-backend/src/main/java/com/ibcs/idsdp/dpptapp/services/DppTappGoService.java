package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.dpptapp.model.domain.DppTappGo;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppTappGoDto;
import org.springframework.http.ResponseEntity;

public interface DppTappGoService {

    DppTappGo createOrUpdate(DppTappGoDto dppTappGoDto);

    DppTappGo findByPcUuidAndOrderType(String pcUuid, String orderType);

    ResponseEntity<ResponseStatus> deleteDppTappGo(String pcUuid, String orderType);


}
