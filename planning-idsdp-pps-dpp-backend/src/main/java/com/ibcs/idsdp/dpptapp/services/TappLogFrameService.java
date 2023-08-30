package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.web.dto.TappLogFrameDTO;

public interface TappLogFrameService {
     ResponseWithResults getTappLogFrame(String pcUuid);

     TappLogFrameDTO updateTappLogFrame(TappLogFrameDTO dto, String pcUuid);
}
