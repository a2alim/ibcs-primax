package com.ibcs.idsdp.rpm.services.implementation;

import java.util.ArrayList;
import java.util.List;

import org.springframework.cglib.core.CollectionUtils;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.NewMember;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.repositories.NewMemberRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherPresentationRepository;
import com.ibcs.idsdp.rpm.services.NewMemberService;
import com.ibcs.idsdp.rpm.web.dto.request.NewMemberRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.NewMemberResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
public class NewMemberServiceImpl extends BaseService<NewMember, NewMemberRequestDto, NewMemberResponseDto>
		implements NewMemberService {

	private final NewMemberRepository newMemberRepository;
	private final ResearcherPresentationRepository researcherPresentationRepository;

	protected NewMemberServiceImpl(ServiceRepository<NewMember> repository, NewMemberRepository newMemberRepository,
			ResearcherPresentationRepository researcherPresentationRepository) {
		super(repository);
		this.newMemberRepository = newMemberRepository;
		this.researcherPresentationRepository = researcherPresentationRepository;
	}

	@Override
	public Response<NewMemberResponseDto> saveOrUpdateNewMemberList(List<NewMemberRequestDto> newMemberList) {
		try {

			List<NewMemberResponseDto> list = new ArrayList<>();

			for (NewMemberRequestDto e : newMemberList) {
				if (e.getUuid() != null) {
					if (e.getDeleted() == 1) {
						delete(e.getUuid());
					} else {
						list.add(getValueFromObject(update(e).getObj(), NewMemberResponseDto.class));
					}
				} else {
					list.add(getValueFromObject(create(e).getObj(), NewMemberResponseDto.class));
				}
			}

			return new Response<NewMemberResponseDto>() {
				{
					setSuccess(true);
					setItems(list);
				}
			};

		} catch (Exception e) {
			log.error("Save not Saved");
			return getErrorResponse("Save Failed");
		}
	}

	@Override
	protected NewMember convertForCreate(NewMemberRequestDto dto) {

		ResearcherPresentation researcherPresentation = null;

		if (dto.getM2ResearcherPresentationId() != null) {
			researcherPresentation = researcherPresentationRepository
					.findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
		}

		NewMember entity = super.convertForCreate(dto);
		entity.setResearcherPresentation(researcherPresentation);
		return entity;
	}

	@Override
	protected void convertForUpdate(NewMemberRequestDto dto, NewMember entity) {

		ResearcherPresentation researcherPresentation = null;

		if (dto.getM2ResearcherPresentationId() != null) {
			researcherPresentation = researcherPresentationRepository
					.findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
		}

		entity.setResearcherPresentation(researcherPresentation);
		super.convertForUpdate(dto, entity);
	}

	public Response<NewMemberResponseDto> findAllByResearcherPresentationId(Long researcherPresentationId) {

		ResearcherPresentation researcherPresentation = researcherPresentationRepository.findByIdAndIsDeleted(researcherPresentationId, false).orElse(null);
		
		List<NewMember> list = newMemberRepository.findAllByResearcherPresentationIdAndIsDeleted(researcherPresentation.getId(), false);

		if (list != null && list.size() > 0) {

			return new Response<NewMemberResponseDto>() {{
				setMessage("Data Found!.");
				setSuccess(true);
				setItems(convertForRead(list));
			}};
		}

		return getErrorResponse("Data Not Found!.");
	}
}
