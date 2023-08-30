package com.ibcs.idsdp.rpm.services.implementation;

import java.util.Optional;

import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.services.MailService;
import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.MailResponseDto;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.LinkupProposalWithEvaluators;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.LinkupProposalWithEvaluatorsRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfilePersonalInfoMasterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.LinkupProposalWithEvaluatorsService;
import com.ibcs.idsdp.rpm.web.dto.request.LinkupProposalWithEvaluatorsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.LinkupProposalWithEvaluatorsResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
public class LinkupProposalWithEvaluatorsServiceImpl extends
		BaseService<LinkupProposalWithEvaluators, LinkupProposalWithEvaluatorsRequestDto, LinkupProposalWithEvaluatorsResponseDto>
		implements LinkupProposalWithEvaluatorsService {

	private final LinkupProposalWithEvaluatorsRepository linkupProposalWithEvaluatorsRepository;
	private final ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository;
	private final ResearcherProposalRepository researcherProposalRepository;
	private final MailService mailService;
	private final RmsConfigurationClientService rmsConfigurationClientService;
	private final UaaClientService uaaClientService;

	protected LinkupProposalWithEvaluatorsServiceImpl(ServiceRepository<LinkupProposalWithEvaluators> repository,
			LinkupProposalWithEvaluatorsRepository linkupProposalWithEvaluatorsRepository,
			ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository,
			ResearcherProposalRepository researcherProposalRepository, MailService mailService,
			RmsConfigurationClientService rmsConfigurationClientService, UaaClientService uaaClientService) {
		super(repository);
		this.linkupProposalWithEvaluatorsRepository = linkupProposalWithEvaluatorsRepository;
		this.researcherProfilePersonalInfoMasterRepository = researcherProfilePersonalInfoMasterRepository;
		this.researcherProposalRepository = researcherProposalRepository;
		this.mailService = mailService;
		this.rmsConfigurationClientService = rmsConfigurationClientService;
		this.uaaClientService = uaaClientService;
	}

	@Override
	protected LinkupProposalWithEvaluatorsResponseDto convertForRead(LinkupProposalWithEvaluators e) {
		LinkupProposalWithEvaluatorsResponseDto dto = super.convertForRead(e);

		if (dto.getStProfileOfExpertEvaluatorsId() != null) {
			Response<ExpertEvaluatorResponseDto> response = rmsConfigurationClientService
					.getByExpertEvaluatorId(dto.getStProfileOfExpertEvaluatorsId());
			dto.setExpertEvaluatorsDto(response.getObj());
		}

		return dto;
	}

	@Override
	protected LinkupProposalWithEvaluators convertForCreate(
			LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto) {

		LinkupProposalWithEvaluators linkupProposalWithEvaluators = super.convertForCreate(
				linkupProposalWithEvaluatorsRequestDto);

		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(linkupProposalWithEvaluatorsRequestDto.getResearcherProposalId(), false);

		if (researcherProposal.isEmpty()) {
			log.info("Researcher Profile Personal Info not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Profile Personal Info not found");
		}

		linkupProposalWithEvaluators.setResearcherProposal(researcherProposal.get());
		return linkupProposalWithEvaluators;
	}

	@Override
	protected void convertForUpdate(LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto,
			LinkupProposalWithEvaluators linkupProposalWithEvaluators) {

		Optional<ResearcherProposal> researcherProposal = researcherProposalRepository
				.findByIdAndIsDeleted(linkupProposalWithEvaluatorsRequestDto.getResearcherProposalId(), false);

		if (researcherProposal.isEmpty()) {
			log.info("Researcher Profile Personal Info not found");
			throw new ServiceExceptionHolder.InvalidRequestException("Researcher Profile Personal Info not found");
		}

		linkupProposalWithEvaluators.setResearcherProposal(researcherProposal.get());
		super.convertForUpdate(linkupProposalWithEvaluatorsRequestDto, linkupProposalWithEvaluators);
	}

	@Override
	public Response<LinkupProposalWithEvaluatorsResponseDto> update(
			LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto) {

		if (linkupProposalWithEvaluatorsRequestDto.getMailStatus() == 1
				&& (linkupProposalWithEvaluatorsRequestDto.getEmailFor() != null
						&& linkupProposalWithEvaluatorsRequestDto.getEmailFor().equals("Evaluator"))) {
			return sendMail(linkupProposalWithEvaluatorsRequestDto);
		}
		if (linkupProposalWithEvaluatorsRequestDto.getMailStatusForProMarks() == 1
				&& (linkupProposalWithEvaluatorsRequestDto.getEmailFor() != null
						&& linkupProposalWithEvaluatorsRequestDto.getEmailFor().equals("EvaluatorForProMarks"))) {
			return sendMail(linkupProposalWithEvaluatorsRequestDto);
		} else {
			return super.update(linkupProposalWithEvaluatorsRequestDto);
		}

		// return (linkupProposalWithEvaluatorsRequestDto.getMailStatus() == 1 &&
		// (linkupProposalWithEvaluatorsRequestDto.getEmailFor() !=null)) ?
		// sendMail(linkupProposalWithEvaluatorsRequestDto) :
		// super.update(linkupProposalWithEvaluatorsRequestDto);
	}

	private Response<LinkupProposalWithEvaluatorsResponseDto> sendMail(
			LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto) {

		if (linkupProposalWithEvaluatorsRequestDto.getStProfileOfExpertEvaluatorsId() == null
				&& linkupProposalWithEvaluatorsRequestDto.getMailBodyContentForProMarks() == null) {
			return getErrorResponse("Evaluator not found!.");
		}

		Response<ExpertEvaluatorResponseDto> evaluator = null;

		if ((linkupProposalWithEvaluatorsRequestDto.getStProfileOfExpertEvaluatorsId() != null)
				&& (linkupProposalWithEvaluatorsRequestDto.getEmailFor().equalsIgnoreCase("Evaluator"))) {
			evaluator = rmsConfigurationClientService
					.getByExpertEvaluatorId(linkupProposalWithEvaluatorsRequestDto.getStProfileOfExpertEvaluatorsId());
		}

		if ((linkupProposalWithEvaluatorsRequestDto.getStProfileOfExpertEvaluatorsIdForProMarks() != null)
				&& (linkupProposalWithEvaluatorsRequestDto.getEmailFor().equalsIgnoreCase("EvaluatorForProMarks"))) {
			evaluator = rmsConfigurationClientService.getByExpertEvaluatorId(
					linkupProposalWithEvaluatorsRequestDto.getStProfileOfExpertEvaluatorsIdForProMarks());
		}

		if (evaluator.isSuccess()) {
			ResponseEntity<UserResponse> user = uaaClientService.getUser(evaluator.getObj().getUserId());
			if (user.getBody() != null) {
				MailRequestDto mailRequestDto = new MailRequestDto();
				mailRequestDto
						.setSubject((linkupProposalWithEvaluatorsRequestDto.getEmailFor().equalsIgnoreCase("Evaluator"))
								? linkupProposalWithEvaluatorsRequestDto.getSubject()
								: linkupProposalWithEvaluatorsRequestDto.getSubjectForProMarks());
				mailRequestDto
						.setBody((linkupProposalWithEvaluatorsRequestDto.getEmailFor().equalsIgnoreCase("Evaluator"))
								? linkupProposalWithEvaluatorsRequestDto.getMailBodyContent()
								: linkupProposalWithEvaluatorsRequestDto.getMailBodyContentForProMarks());
				mailRequestDto.setIsAttachment(false);
				mailRequestDto.setTemplateName("default-email-template");
				mailRequestDto.setTo(user.getBody().getEmailId());
				MailResponseDto mailResponseDto = mailService.sendMail(mailRequestDto);
				if (mailResponseDto != null) {
					return super.update(linkupProposalWithEvaluatorsRequestDto);
				}
			} else {
				getErrorResponse("User Not Found");
			}
		} else {
			getErrorResponse(evaluator.getMessage());
		}
		return getErrorResponse("Mail Save Failed");
	}

	@Override
	public Response<LinkupProposalWithEvaluatorsResponseDto> saveLinkupProposalWithEvaluators(
			LinkupProposalWithEvaluatorsRequestDto linkupProposalWithEvaluatorsRequestDto) {

		return null;
	}

	@Override
	public Response<LinkupProposalWithEvaluatorsResponseDto> findByResearcherProposal(Long researcherProposalId) {

		Optional<LinkupProposalWithEvaluators> optional = linkupProposalWithEvaluatorsRepository
				.findByResearcherProposalAndIsDeleted(new ResearcherProposal() {
					{
						setId(researcherProposalId);
					}
				}, false);

		if (optional.isPresent()) {
			return new Response<LinkupProposalWithEvaluatorsResponseDto>() {
				{
					setObj(convertForRead(optional.get()));
					setSuccess(true);
					setMessage("Data Found !.");
				}
			};
		}

		return getErrorResponse("Data Not Found!.");
	}

}
