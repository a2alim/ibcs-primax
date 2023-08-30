package com.ibcs.idsdp.rmsConfigration.services;

import com.ibcs.idsdp.rmsConfigration.web.dto.response.ZillaResponse;
import com.ibcs.idsdp.util.Response;

public interface ZillaService {
	
	Response<ZillaResponse> findByDivision( Long divisionId);

   
}
