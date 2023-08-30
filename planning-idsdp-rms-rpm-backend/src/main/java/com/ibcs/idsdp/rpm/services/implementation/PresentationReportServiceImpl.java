package com.ibcs.idsdp.rpm.services.implementation;

import java.util.Optional;

import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.PresentationReport;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.PresentationReportRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherPresentationRepository;
import com.ibcs.idsdp.rpm.services.PresentationReportService;
import com.ibcs.idsdp.rpm.web.dto.request.PresentationReportRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.PresentationReportResponseDto;
import com.ibcs.idsdp.util.Response;

@Service
public class PresentationReportServiceImpl
		extends BaseService<PresentationReport, PresentationReportRequestDto, PresentationReportResponseDto>
		implements PresentationReportService {

	private final CreateSeminarRepository createSeminarRepository;
	private final PresentationReportRepository presentationReportRepository;
	private final ResearcherPresentationRepository researcherPresentationRepository;

	protected PresentationReportServiceImpl(ServiceRepository<PresentationReport> repository,
			PresentationReportRepository presentationReportRepository,
			ResearcherPresentationRepository researcherPresentationRepository,
			CreateSeminarRepository createSeminarRepository) {
		super(repository);
		this.presentationReportRepository = presentationReportRepository;
		this.researcherPresentationRepository = researcherPresentationRepository;
		this.createSeminarRepository = createSeminarRepository;
	}

	@Override
	protected PresentationReport convertForCreate(PresentationReportRequestDto dto) {

		CreateSeminar createSeminar = null;

		if (dto.getCreateSeminarUuid() != null) {
			createSeminar = createSeminarRepository.findByUuidAndIsDeleted(dto.getCreateSeminarUuid(), false)
					.orElse(null);
		}

		PresentationReport entity = super.convertForCreate(dto);
		entity.setIsEditable(true);
		entity.setCreateSeminar(createSeminar);
		return entity;
	}

	@Override
	protected void convertForUpdate(PresentationReportRequestDto dto, PresentationReport entity) {

		CreateSeminar createSeminar = null;
		if (dto.getCreateSeminarUuid() != null) {
			createSeminar = createSeminarRepository.findByUuidAndIsDeleted(dto.getCreateSeminarUuid(), false)
					.orElse(null);
		}
		entity.setCreateSeminar(createSeminar);
		super.convertForUpdate(dto, entity);
	}

	@Override
	public Response<PresentationReportResponseDto> findByCreateSeminarUuid(String createSeminarUuid) {

		CreateSeminar createSeminar = null;

		if (createSeminarUuid != null) {
			createSeminar = createSeminarRepository.findByUuidAndIsDeleted(createSeminarUuid, false).orElse(null);
		}

		if (createSeminar == null) {
			return getErrorResponse("Create Seminar Not Found!.");
		}

		PresentationReport presentationReport = presentationReportRepository
				.findByCreateSeminarAndIsDeleted(createSeminar, false).orElse(null);

		if (presentationReport != null) {

			return new Response<PresentationReportResponseDto>() {
				{
					setMessage("Data Found!.");
					setSuccess(true);
					setObj(convertForRead(presentationReport));
				}
			};
		}

		return getErrorResponse("Data Not Found!.");

	}

	@Override
	public Boolean seminarIsExists(Long seminarId) {

		Optional<CreateSeminar> optional = createSeminarRepository.findByIdAndIsDeleted(seminarId, false);

		if (optional.isEmpty()) {

			return false;
		}
		return presentationReportRepository.existsByCreateSeminar(optional.get());
	}

}
