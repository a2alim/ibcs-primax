package com.ibcs.idsdp.rpm.services.implementation;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.MemberInSeminar;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.MemberInSeminarRepository;
import com.ibcs.idsdp.rpm.services.MemberInSeminarService;
import com.ibcs.idsdp.rpm.web.dto.request.MemberInSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MemberInSeminarResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalRscWorkingInOrgResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class MemberInSeminarImpl extends BaseService<MemberInSeminar, MemberInSeminarRequestDto, MemberInSeminarResponseDto> implements MemberInSeminarService {

	private final MemberInSeminarRepository memberInSeminarRepository;
	private final CreateSeminarRepository createSeminarRepository;

	protected MemberInSeminarImpl(ServiceRepository<MemberInSeminar> repository,
			MemberInSeminarRepository memberInSeminarRepository, CreateSeminarRepository createSeminarRepository) {
		super(repository);
		this.memberInSeminarRepository = memberInSeminarRepository;
		this.createSeminarRepository = createSeminarRepository;
	}

	@Override
	protected List<MemberInSeminarResponseDto> convertForRead(List<MemberInSeminar> e) {
		return super.convertForRead(e);
	}

	@Override
	protected MemberInSeminar convertForCreate(MemberInSeminarRequestDto i) {
		
		MemberInSeminar entity = super.convertForCreate(i);
		
		if (i.getCreateSeminarId() != null) {
			Optional<CreateSeminar> optional = createSeminarRepository.findByIdAndIsDeleted(i.getCreateSeminarId(),false);
			entity.setCreateSeminarId(optional.get());
		}
		
		return entity;
	}

	@Override
	protected void convertForUpdate(MemberInSeminarRequestDto dto, MemberInSeminar entity) {
		
		CreateSeminar createSeminar = null;
		if (dto.getCreateSeminarId() != null) {
			createSeminar = createSeminarRepository.findByIdAndIsDeleted(dto.getCreateSeminarId(),false).orElse(null);
		}

		entity.setCreateSeminarId(createSeminar);
		super.convertForUpdate(dto, entity);
	}

	@Override
	public Response<MemberInSeminarResponseDto> findByCreateSeminarId(Long createSeminarId) {
		
		Optional<CreateSeminar> optional = createSeminarRepository.findByIdAndIsDeleted(createSeminarId,false);
		if(!optional.isPresent()) {
			return getErrorResponse("Seminar not found!.");
		}	
				
		List<MemberInSeminar> list= 	 memberInSeminarRepository.findAllByCreateSeminarIdAndIsDeleted(optional.get(),false);		
		
		if(list!=null && list.size() > 0) {		
			return new Response<MemberInSeminarResponseDto>() {{
				setSuccess(true);
				setMessage("data found!.");
				setItems(convertForRead(list));
			}};
		}		
		
		return getErrorResponse("Data not found!.");
	}

	@Override
	public Response<MemberInSeminarResponseDto> createList(List<MemberInSeminarRequestDto> memberInSeminarRequestDtoList) {		
		
		try {
			List<MemberInSeminarResponseDto> list = new ArrayList<>();
			memberInSeminarRequestDtoList.forEach(e -> {
				if (e.getUuid() != null) {
					if (e.getIsDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(new ModelMapper().map(update(e).getObj(), MemberInSeminarResponseDto.class));
					}
				} else {
					list.add(new ModelMapper().map(create(e).getObj(), MemberInSeminarResponseDto.class));
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
