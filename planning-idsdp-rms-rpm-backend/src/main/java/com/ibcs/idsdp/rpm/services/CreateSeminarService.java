package com.ibcs.idsdp.rpm.services;

import com.ibcs.idsdp.util.Response;

import java.util.Map;

import org.springframework.web.bind.annotation.PathVariable;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
public interface CreateSeminarService {

	Response<Map<String, Object>> getSeminarView(Long id);	
	Response<Map<String, Object>> seminarDetailsFindBySeminarId(Long seminarId);
	
}
