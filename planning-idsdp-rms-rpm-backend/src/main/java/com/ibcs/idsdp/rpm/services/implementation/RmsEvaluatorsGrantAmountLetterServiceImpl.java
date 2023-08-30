package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.client.dto.response.FiscalResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalInstituteInfo;
import com.ibcs.idsdp.rpm.model.domain.RmsEvaluatorsGrantAmountLetter;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalInstituteInfoRepository;
import com.ibcs.idsdp.rpm.model.repositories.RmsEvaluatorsGrantAmountLetterRepository;
import com.ibcs.idsdp.rpm.services.RmsEvaluatorsGrantAmountLetterService;
import com.ibcs.idsdp.rpm.web.dto.request.FiscalYearIdAndPageableRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.RmsEvaluatorsGrantAmountLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.RmsEvaluatorsGrantAmountResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class RmsEvaluatorsGrantAmountLetterServiceImpl extends
		BaseService<RmsEvaluatorsGrantAmountLetter, RmsEvaluatorsGrantAmountLetterRequestDto, RmsEvaluatorsGrantAmountLetterResponseDto>
		implements RmsEvaluatorsGrantAmountLetterService {

	private final RmsEvaluatorsGrantAmountLetterRepository repository;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final RmsEvaluatorsGrantAmountServiceImpl rmsEvaluatorsGrantAmountServiceImpl;
	private final ResearcherProposalInstituteInfoRepository researcherProposalInstituteInfoRepository;
	private final MinioServerService minioServerService;

	protected RmsEvaluatorsGrantAmountLetterServiceImpl(
			ServiceRepository<RmsEvaluatorsGrantAmountLetter> rmsEvaluatorsGrantAmountLetterRepository,
			RmsEvaluatorsGrantAmountLetterRepository repository,
			RmsConfigurationClientService rmsConfigurationClientService,
			RmsEvaluatorsGrantAmountServiceImpl rmsEvaluatorsGrantAmountServiceImpl,
			ResearcherProposalInstituteInfoRepository researcherProposalInstituteInfoRepository,
			MinioServerService minioServerService) {
		super(rmsEvaluatorsGrantAmountLetterRepository);
		this.repository = repository;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.rmsEvaluatorsGrantAmountServiceImpl = rmsEvaluatorsGrantAmountServiceImpl;
		this.researcherProposalInstituteInfoRepository = researcherProposalInstituteInfoRepository;
		this.minioServerService = minioServerService;
	}

	@Override
	protected List<RmsEvaluatorsGrantAmountLetterResponseDto> convertForRead(List<RmsEvaluatorsGrantAmountLetter> e) {
		List<RmsEvaluatorsGrantAmountLetterResponseDto> list = super.convertForRead(e);
		if (list.isEmpty()) {
			return list;
		}
		Map<Long, FiscalResponseDto> fiscalResponseDtoMap = rmsConfigurationClientService
				.getByFiscalYearIdSet(new IdSetRequestBodyDTO() {
					{
						setIds(list.stream().map(RmsEvaluatorsGrantAmountLetterResponseDto::getStFiscalYearId)
								.collect(Collectors.toSet()));
					}
				}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

		return list.stream().peek(p -> p.setFiscalYear(fiscalResponseDtoMap.get(p.getStFiscalYearId())))
				.collect(Collectors.toList());
	}

	@Override
	public Response<RmsEvaluatorsGrantAmountLetterResponseDto> getByFiscalYearId(
			FiscalYearIdAndPageableRequestDto requestDto) {
		Response<RmsEvaluatorsGrantAmountLetterResponseDto> response = new Response<>();
		Pageable pageable = this.getPageable(requestDto.getPageable());
		Page<RmsEvaluatorsGrantAmountLetter> rmsEvaluatorsGrantAmountLetters = repository
				.findAllByStFiscalYearIdAndIsDeleted(requestDto.getFiscalYearId(), false, pageable);

		if (rmsEvaluatorsGrantAmountLetters.getContent().isEmpty()) {
			return getSuccessResponse("Data Empty");
		}

		response.setSuccess(true);
		response.setMessage("Data Found");
		response.setPage(new PageImpl<>(convertForRead(rmsEvaluatorsGrantAmountLetters.getContent()), pageable,
				rmsEvaluatorsGrantAmountLetters.getTotalElements()));
		return response;
	}

	@Override
	public Response<RmsEvaluatorsGrantAmountLetterResponseDto> uploadDocById(Long id, Optional<MultipartFile> file) {

		if (file.isEmpty()) {
			return getErrorResponse("File Not Found");
		}

		Optional<RmsEvaluatorsGrantAmountLetter> letter = repository.findByIdAndIsDeleted(id, false);
		if (letter.isEmpty()) {
			return getErrorResponse("Rms Evaluators Grant Amount Letter Not Found");
		}

		FileUploadResponse fileUploadResponse = minioServerService.getFileDownloadUrl(file.get(), "rms");
		letter.get().setUploadSignatureFile(fileUploadResponse.getDownloadUrl());
		repository.save(letter.get());
		return new Response<RmsEvaluatorsGrantAmountLetterResponseDto>() {
			{
				setMessage("File Uploaded");
				setObj(convertForRead(letter.get()));
			}
		};
	}

	@Override
	public Response<RmsEvaluatorsGrantAmountLetterResponseDto> getByUuidWithADetails(String uuid) {

		Optional<RmsEvaluatorsGrantAmountLetter> letter = repository.findByUuidAndIsDeleted(uuid, false);
		if (letter.isEmpty()) {
			getErrorResponse("Data not found by this uuid");
		}

		Response<FiscalResponseDto> fiscalYear = rmsConfigurationClientService
				.getByFiscalYearId(letter.get().getStFiscalYearId());
		if (!fiscalYear.isSuccess()) {
			getErrorResponse("Fiscal year data not found");
		}

		Response<RmsEvaluatorsGrantAmountLetterResponseDto> response = new Response<>();
		response.setMessage("Data Found");
		response.setObj(convertForRead(letter.get()));
		response.getObj().setFiscalYear(fiscalYear.getObj());

		List<RmsEvaluatorsGrantAmountResponseDto> details = rmsEvaluatorsGrantAmountServiceImpl
				.getListByRmsEvaluatorsGrantAmountLetterId(letter.get().getId());

		if (details != null && details.size() > 0) {

			Map<Long, ResearchCategoryTypeResponseDto> researchCategoryTypeResponseDtoMap = rmsConfigurationClientService
					.getByResearchCategoryTypeByIdSet(new IdSetRequestBodyDTO() {
						{
							setIds(details.stream().map(m -> m.getResearcherProposalDto().getStResearchCatTypeId())
									.collect(Collectors.toSet()));
						}
					}).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

			response.getObj().setDetails(details.stream().peek(p -> {
				ResearcherProposalInstituteInfo researcherProposalInstituteInfo = researcherProposalInstituteInfoRepository
						.findByResearcherProposalId(p.getResearcherProposalId());
				p.getResearcherProposalDto().setInstituteName((researcherProposalInstituteInfo == null) ? ""
						: researcherProposalInstituteInfo.getInstituteName());
				p.getResearcherProposalDto().setResearchCategoryType(
						researchCategoryTypeResponseDtoMap.get(p.getResearcherProposalDto().getStResearchCatTypeId()));
			}).collect(Collectors.toList()));
			response.getObj().getDetails().add(new RmsEvaluatorsGrantAmountResponseDto() {
				{
					setGrantAmount(
							details.stream().mapToDouble(RmsEvaluatorsGrantAmountResponseDto::getGrantAmount).sum());
				}
			});

		}

		return response;
	}
}
