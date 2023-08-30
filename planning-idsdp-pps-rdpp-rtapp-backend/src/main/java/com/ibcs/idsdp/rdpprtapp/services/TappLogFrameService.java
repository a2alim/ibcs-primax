package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.web.dto.TappLogFrameDTO;

public interface TappLogFrameService {
     ResponseWithResults getTappLogFrame(String pcUuid);

     TappLogFrameDTO updateTappLogFrame(TappLogFrameDTO dto, String pcUuid);
}
