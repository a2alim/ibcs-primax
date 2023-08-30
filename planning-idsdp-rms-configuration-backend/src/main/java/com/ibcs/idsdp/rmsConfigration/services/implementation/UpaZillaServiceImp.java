package com.ibcs.idsdp.rmsConfigration.services.implementation;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.UpaZilla;
import com.ibcs.idsdp.rmsConfigration.model.repositories.UpaZillaRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ZillaRepository;
import com.ibcs.idsdp.rmsConfigration.services.UpaZillaService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.UpaZillaResponse;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class UpaZillaServiceImp extends BaseService<UpaZilla, UpaZillaRequest, UpaZillaResponse>
		implements UpaZillaService {

	private final UpaZillaRepository upaZillaRepository;
	private final ZillaServiceImp zillaServiceImp;
	private final ZillaRepository zillaRepository;

	public UpaZillaServiceImp(UpaZillaRepository upaZillaRepository, ZillaServiceImp zillaServiceImp,
			ZillaRepository zillaRepository) {
		super(upaZillaRepository);
		this.upaZillaRepository = upaZillaRepository;
		this.zillaServiceImp = zillaServiceImp;
		this.zillaRepository = zillaRepository;
	}

	@Override
	public Response<UpaZillaResponse> findByZilla(Long zillaId) {

		List<UpaZilla> responseList = upaZillaRepository.findAllByZillaIdAndStatusAndIsDeletedOrderByNameEnAsc(zillaId, true, false);

		if (responseList != null && responseList.size() > 0) {
			return new Response<UpaZillaResponse>() {
				{
					setItems(convertForRead(responseList));
					setMessage("Data Found !.");
					setSuccess(true);
				}
			};
		}

		return getErrorResponse("Data Not Found !.");
	}
}
