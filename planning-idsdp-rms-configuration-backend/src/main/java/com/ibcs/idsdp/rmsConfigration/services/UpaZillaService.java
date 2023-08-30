package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.web.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.util.Response;

public interface UpaZillaService {

	Response<UpaZillaResponse> findByZilla(Long zillaId);

}
