package com.ibcs.idsdp.rmsConfigration.services.implementation;

import static java.lang.Boolean.FALSE;
import static java.lang.Boolean.TRUE;

import java.util.List;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.Division;
import com.ibcs.idsdp.rmsConfigration.model.repositories.DivisionRepository;
import com.ibcs.idsdp.rmsConfigration.services.DivisionService;
import com.ibcs.idsdp.rmsConfigration.services.UpaZillaService;
import com.ibcs.idsdp.rmsConfigration.services.ZillaService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.DivisionRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.DivisionResponse;
import com.ibcs.idsdp.util.Response;


@Service
public class DivisionServiceImp extends BaseService<Division, DivisionRequest, DivisionResponse> implements DivisionService {

	private final DivisionRepository divisionRepository;
	private final ZillaService zillaService;
	private final UpaZillaService upaZillaService;

	public DivisionServiceImp(DivisionRepository divisionRepository, ZillaService zillaService,
			UpaZillaService upaZillaService) {
		super(divisionRepository);
		this.divisionRepository = divisionRepository;
		this.zillaService = zillaService;
		this.upaZillaService = upaZillaService;
	}

	@Override
	public Response<DivisionResponse> getActiveDivision() {

		List<Division> divisionList = divisionRepository.findAllByStatusAndIsDeletedOrderByNameEnAsc(TRUE, FALSE);

		if (divisionList != null && divisionList.size() > 0) {
			return new Response<DivisionResponse>() {
				{
					setItems(convertForRead(divisionList));
					setSuccess(true);
					setMessage("Data Found !");
				}
			};
		}

		return getErrorResponse("Data Not Found !.");

	}

}
