package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.rdpprtapp.web.dto.response.LogFrameResponse;

public interface LogFrameService {

    DppLogFrame getLogFrameByPcid(Long pcid);

    ResponseWithResults getLogFrame(String pcUuid);

    ResponseWithResults getLogFrameById(Long id);

    LogFrameResponse updateLogFrame(LogFrameResponse response, Long id);

}
