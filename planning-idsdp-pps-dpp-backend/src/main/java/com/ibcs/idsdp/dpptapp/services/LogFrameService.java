package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.dpptapp.web.dto.LogFrameDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.LogFrameResponse;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface LogFrameService {

    DppLogFrame getLogFrameByPcid(Long pcid);

    ResponseWithResults getLogFrame(String pcUuid);

    LogFrameResponse updateLogFrame(LogFrameResponse response, String pcUuid);

}
