package com.ibcs.idsdp.rmsConfigration.services.implementation;

import java.util.List;
import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.Division;
import com.ibcs.idsdp.rmsConfigration.model.domain.Zilla;
import com.ibcs.idsdp.rmsConfigration.model.repositories.DivisionRepository;
import com.ibcs.idsdp.rmsConfigration.model.repositories.ZillaRepository;
import com.ibcs.idsdp.rmsConfigration.services.ZillaService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.ZillaRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.ZillaResponse;
import com.ibcs.idsdp.util.Response;

@Service
public class ZillaServiceImp extends BaseService<Zilla, ZillaRequest, ZillaResponse> implements ZillaService {

	private final ZillaRepository zillaRepository;
	private final DivisionRepository divisionRepository;

	protected ZillaServiceImp(ServiceRepository<Zilla> repository, ZillaRepository zillaRepository,
			DivisionRepository divisionRepository) {
		super(repository);
		this.zillaRepository = zillaRepository;
		this.divisionRepository = divisionRepository;

	}

	@Override
	public Response<ZillaResponse> findByDivision(Long divisionId) {

		// Optional<Division> divisionOptional =
		// divisionRepository.findByIdAndIsDeleted(divisionId, false);

		List<Zilla> responseList = zillaRepository.findAllByDivisionIdAndStatusAndIsDeletedOrderByNameEnAsc(divisionId, true, false);
		if (responseList != null && responseList.size() > 0) {
			return new Response<ZillaResponse>() {
				{
					setSuccess(true);
					setMessage("Data Found !.");
					setItems(convertForRead(responseList));
				}
			};
		}
		return getErrorResponse("Data Not Found!.");
	}

}
