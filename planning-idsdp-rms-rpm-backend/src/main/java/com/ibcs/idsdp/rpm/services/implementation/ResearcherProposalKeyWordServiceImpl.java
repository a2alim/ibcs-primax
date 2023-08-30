package com.ibcs.idsdp.rpm.services.implementation;

import java.util.ArrayList;
import java.util.List;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalKeyWord;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalKeyWordRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalKeyWordService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalKeyWordRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalKeyWordResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class ResearcherProposalKeyWordServiceImpl extends BaseService<ResearcherProposalKeyWord, ResearcherProposalKeyWordRequestDto, ResearcherProposalKeyWordResponseDto> implements  ResearcherProposalKeyWordService   {

	
	private final ResearcherProposalKeyWordRepository researcherProposalKeyWordRepository;	
	
	protected ResearcherProposalKeyWordServiceImpl(ServiceRepository<ResearcherProposalKeyWord> repository, ResearcherProposalKeyWordRepository researcherProposalKeyWordRepository) {
		super(repository);	
		this.researcherProposalKeyWordRepository = researcherProposalKeyWordRepository;
	}

	@Override
	public Response<ResearcherProposalKeyWordResponseDto> createList(List<ResearcherProposalKeyWordRequestDto> researcherProposalKeyWordRequestList) {
		
		researcherProposalKeyWordRepository.deleteByResearcherProposalId(researcherProposalKeyWordRequestList.get(0).getResearcherProposalId());		
		try {
			List<ResearcherProposalKeyWordResponseDto> list = new ArrayList<>();
			researcherProposalKeyWordRequestList.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getIsDeleted() == 1l) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(), ResearcherProposalKeyWordResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), ResearcherProposalKeyWordResponseDto.class));
				}
			});
			
			return new Response<>() {{
				setSuccess(true);
				setItems(list);
			}};


		} catch (Exception e) {
			return getErrorResponse("Save Failed!");
		}	
	}

}
