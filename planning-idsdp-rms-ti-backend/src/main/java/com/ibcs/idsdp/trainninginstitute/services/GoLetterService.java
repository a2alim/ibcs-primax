package com.ibcs.idsdp.trainninginstitute.services;

import com.ibcs.idsdp.trainninginstitute.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.util.Response;

public interface GoLetterService {
	
	Response<GoLetterResponseDto> findByUuid(String uuid);

}
