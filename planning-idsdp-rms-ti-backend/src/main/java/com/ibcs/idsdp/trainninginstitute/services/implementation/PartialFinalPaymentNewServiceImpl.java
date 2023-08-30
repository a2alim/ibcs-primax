package com.ibcs.idsdp.trainninginstitute.services.implementation;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import org.apache.commons.collections4.CollectionUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.LoggedUsersService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.trainninginstitute.enums.Status;
import com.ibcs.idsdp.trainninginstitute.model.domain.GoLetter;
import com.ibcs.idsdp.trainninginstitute.model.domain.PartialFinalPaymentNewModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.ProposalModel;
import com.ibcs.idsdp.trainninginstitute.model.domain.TrainingInstituteProfileModel;
import com.ibcs.idsdp.trainninginstitute.model.repositories.GoLetterRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.PartialFinalPaymentNewRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.ProposalRepository;
import com.ibcs.idsdp.trainninginstitute.model.repositories.TrainingInstituteProfileRepository;
import com.ibcs.idsdp.trainninginstitute.services.PartialFinalPaymentNewService;
import com.ibcs.idsdp.trainninginstitute.web.dto.request.PartialFinalPaymentNewRequestDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PartialFinalPaymentNewResponseDto;
import com.ibcs.idsdp.trainninginstitute.web.dto.response.PreviousPaymentResponse;
import com.ibcs.idsdp.util.Response;

@Service
public class PartialFinalPaymentNewServiceImpl extends
		BaseService<PartialFinalPaymentNewModel, PartialFinalPaymentNewRequestDto, PartialFinalPaymentNewResponseDto>
		implements PartialFinalPaymentNewService {

	private final PartialFinalPaymentNewRepository finalPaymentNewRepository;
	private final ProposalRepository proposalRepository;
	private final TrainingInstituteProfileRepository trainingInstituteProfileRepository;
	private final LoggedUsersService loggedUsersService;
	private final GoLetterRepository goLetterRepository;

	protected PartialFinalPaymentNewServiceImpl(ServiceRepository<PartialFinalPaymentNewModel> repository,
			PartialFinalPaymentNewRepository finalPaymentNewRepository, ProposalRepository proposalRepository,
			TrainingInstituteProfileRepository trainingInstituteProfileRepository,
			LoggedUsersService loggedUsersService, GoLetterRepository goLetterRepository) {
		super(repository);
		this.finalPaymentNewRepository = finalPaymentNewRepository;
		this.proposalRepository = proposalRepository;
		this.trainingInstituteProfileRepository = trainingInstituteProfileRepository;
		this.loggedUsersService = loggedUsersService;
		this.goLetterRepository = goLetterRepository;
	}

	@Override
	protected PartialFinalPaymentNewModel convertForCreate(PartialFinalPaymentNewRequestDto dto) {

		PartialFinalPaymentNewModel entity = super.convertForCreate(dto);
		Optional<ProposalModel> optional = proposalRepository.findByIdAndIsDeleted(dto.getProposalId(), false);
		if (optional.isPresent()) {
			entity.setProposalModel(optional.get());
		}

		AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder
				.getContext().getAuthentication().getDetails()).getDecodedDetails();
		trainingInstituteProfileRepository.findByUserId(accessTokenDetail.getId())
				.ifPresentOrElse(entity::setTrainingInstituteProfileId, () -> {
					throw new ResponseStatusException(HttpStatus.NOT_FOUND,
							"Training Institute Profile not found. Please complete your profile first.");
				});

		return entity;
	}

	@Override
	protected void convertForUpdate(PartialFinalPaymentNewRequestDto dto, PartialFinalPaymentNewModel entity) {
		Optional<ProposalModel> optional = proposalRepository.findByIdAndIsDeleted(dto.getProposalId(), false);
		if (optional.isPresent()) {
			entity.setProposalModel(optional.get());
		}
		super.convertForUpdate(dto, entity);
	}

	@Override
	protected List<PartialFinalPaymentNewResponseDto> convertForRead(List<PartialFinalPaymentNewModel> e) {
		List<PartialFinalPaymentNewResponseDto> list = super.convertForRead(e);
		list = list.stream().map(m -> {
			PartialFinalPaymentNewModel emtity = e.stream().filter(f -> f.getId().equals(m.getId())).findFirst().get();
			
			
			m.setTrainingInstituteProfileModel(emtity.getProposalModel().getTrainingInstituteProfileModel());
			m.setProposalModel(emtity.getProposalModel());
			Optional<GoLetter> optional = goLetterRepository
					.findByPartialFinalPaymentIdAndIsDeleted(new PartialFinalPaymentNewModel() {
						{
							setId(m.getId());
						}
					}, false);
			if (optional.isPresent()) {
				m.setGoLetter(optional.get());
			}
			return m;
		}).collect(Collectors.toList());
		return list;
	}

	@Override
	public Response<PreviousPaymentResponse> getPreviousPayments(Long proposalId) {

		List<PartialFinalPaymentNewModel> partialFinalPaymentModels = finalPaymentNewRepository
				.findAllByIsDeletedAndProposalModel_Id(false, proposalId);

		List<PreviousPaymentResponse> previousPaymentResponseList = partialFinalPaymentModels.stream()
				.map(partialFinalPaymentModel -> new PreviousPaymentResponse(
						partialFinalPaymentModel.getInstallmentType(), partialFinalPaymentModel.getInstallmentAmount(),
						partialFinalPaymentModel.getStatus()))
				.collect(Collectors.toList());

		if (previousPaymentResponseList != null && !CollectionUtils.isEmpty(previousPaymentResponseList)) {
			return new Response<PreviousPaymentResponse>() {
				{
					setSuccess(true);
					setMessage("data Found !");
					setItems(previousPaymentResponseList);
				}
			};
		}

		return getErrorResponse("Data not Found!.");
	}

	@Override
	public Response<PartialFinalPaymentNewResponseDto> gridList(PageableRequestBodyDTO requestBodyDTO,
			Long traningInsId) {

		Response<PartialFinalPaymentNewResponseDto> response = new Response();
		Pageable pageable = this.getPageable(requestBodyDTO);
		Page<PartialFinalPaymentNewModel> ePage = null;

		try {

			if (loggedUsersService.getLoggedUserType().equals("Rms_Training_Institute")) {
				AccessTokenDetail accessTokenDetail = (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder
						.getContext().getAuthentication().getDetails()).getDecodedDetails();
				Optional<TrainingInstituteProfileModel> optional = trainingInstituteProfileRepository
						.findByUserId(accessTokenDetail.getId());
				ePage = finalPaymentNewRepository.findAllByIsDeletedAndTrainingInstituteProfileId(false, optional.get(),
						pageable);

			}

			if (loggedUsersService.getLoggedUserType().equals("Rms_DO") && traningInsId != 0) {
				ePage = finalPaymentNewRepository.findAllByIsDeletedAndTrainingInstituteProfileId(false,
						new TrainingInstituteProfileModel() {
							{
								setId(traningInsId);
							}
						}, pageable);
			}

			if (loggedUsersService.getLoggedUserType().equals("Rms_DO") && traningInsId == 0) {
				ePage = finalPaymentNewRepository.findAllByIsDeletedOrderByIdDesc(false, pageable);
			}

			if (!CollectionUtils.isEmpty(ePage.getContent())) {
				response.setPage(
						new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements()));
				return getSuccessResponse("Data found ", response);
			}

			return getSuccessResponse("Data Empty ");

		} catch (Exception e) {
			return getErrorResponse("Data not found !!");
		}
	}

	@Override
	public Response<PartialFinalPaymentNewResponseDto> changeStatus(Long id, Status status) {

		PartialFinalPaymentNewModel response = new PartialFinalPaymentNewModel();
		Response<PartialFinalPaymentNewResponseDto> res = new Response();

		Optional<PartialFinalPaymentNewModel> partialFinalPaymentModelOptional = finalPaymentNewRepository.findByIdAndIsDeleted(id, false);
		if (partialFinalPaymentModelOptional.isPresent()) {

			PartialFinalPaymentNewModel partialFinalPaymentModel = partialFinalPaymentModelOptional.get();
			if (status == Status.APPROVED) {
				partialFinalPaymentModel.setDateOfAcceptance(LocalDate.now());
			}

			partialFinalPaymentModel.setStatus(status);
			response = finalPaymentNewRepository.save(partialFinalPaymentModel);
			res.setObj(convertForRead(response));
			return getSuccessResponse("Update Successfull!.", res);

		}
		return getErrorResponse("Update Failed!.");

	}

}
