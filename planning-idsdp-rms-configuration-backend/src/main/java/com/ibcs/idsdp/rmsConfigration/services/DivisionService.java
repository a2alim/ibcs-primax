package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.web.dto.response.DivisionResponse;
import com.ibcs.idsdp.util.Response;

public interface DivisionService {

	Response<DivisionResponse> getActiveDivision();

}
