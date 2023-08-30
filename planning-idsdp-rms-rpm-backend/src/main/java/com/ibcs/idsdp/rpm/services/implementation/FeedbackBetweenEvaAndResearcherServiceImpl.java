package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.UserResponse;
import com.ibcs.idsdp.rpm.model.domain.*;
import com.ibcs.idsdp.rpm.model.repositories.*;
import com.ibcs.idsdp.rpm.services.FeedbackBetweenEvaAndResearcherService;
import com.ibcs.idsdp.rpm.services.MailService;
import com.ibcs.idsdp.rpm.web.dto.request.FeedbackBetweenEvaAndResearcherRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.FeedbackBetweenEvaAndResearcherResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.MailResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class FeedbackBetweenEvaAndResearcherServiceImpl extends
        BaseService<FeedbackBetweenEvaAndResearcher, FeedbackBetweenEvaAndResearcherRequestDto, FeedbackBetweenEvaAndResearcherResponseDto>
        implements FeedbackBetweenEvaAndResearcherService {

    private final ResearcherPresentationRepository researcherPresentationRepository;
    private final CreateSeminarRepository createSeminarRepository;
    private final ResearcherProposalRepository researcherProposalRepository;
    private final UaaClientService uaaClientService;
    private final CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository;
    private final RmsConfigurationClientService rmsConfigurationClientService;
    private final LinkupProposalWithEvaluatorsRepository linkupProposalWithEvaluatorsRepository;
    private final PresentationEvaluatorsFeedbackRepository presentationEvaluatorsFeedbackRepository;
    private final MailService mailService;

    protected FeedbackBetweenEvaAndResearcherServiceImpl(ServiceRepository<FeedbackBetweenEvaAndResearcher> repository,
                                                         ResearcherPresentationRepository researcherPresentationRepository,
                                                         CreateSeminarRepository createSeminarRepository, ResearcherProposalRepository researcherProposalRepository,
                                                         UaaClientService uaaClientService, CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository,
                                                         RmsConfigurationClientService rmsConfigurationClientService,
                                                         LinkupProposalWithEvaluatorsRepository linkupProposalWithEvaluatorsRepository,
                                                         PresentationEvaluatorsFeedbackRepository presentationEvaluatorsFeedbackRepository, MailService mailService) {
        super(repository);
        this.researcherPresentationRepository = researcherPresentationRepository;
        this.createSeminarRepository = createSeminarRepository;
        this.researcherProposalRepository = researcherProposalRepository;
        this.uaaClientService = uaaClientService;
        this.createSeminarTimeScheduleRepository = createSeminarTimeScheduleRepository;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
        this.linkupProposalWithEvaluatorsRepository = linkupProposalWithEvaluatorsRepository;
        this.presentationEvaluatorsFeedbackRepository = presentationEvaluatorsFeedbackRepository;
        this.mailService = mailService;
    }

    @Override
    protected FeedbackBetweenEvaAndResearcher convertForCreate(FeedbackBetweenEvaAndResearcherRequestDto dto) {

        ResearcherPresentation researcherPresentation = null;
        CreateSeminar createSeminar = null;
        ResearcherProposal researcherProposal = null;

        if (dto.getM2ResearcherPresentationId() != null) {
            researcherPresentation = researcherPresentationRepository
                    .findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
        }

        if (dto.getM2CreateSeminarId() != null) {
            createSeminar = createSeminarRepository.findByIdAndIsDeleted(dto.getM2CreateSeminarId(), false)
                    .orElse(null);
        }

        if (dto.getM1ResearcherProposalId() != null) {
            researcherProposal = researcherProposalRepository
                    .findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false).orElse(null);
        }

        if (dto.getSendTo().equalsIgnoreCase("Researcher")) {
            presentationEvaluatorsFeedbackRepository.updateIsVisible(true, dto.getM1ResearcherProposalId());
        }

        FeedbackBetweenEvaAndResearcher entity = super.convertForCreate(dto);
        entity.setResearcherPresentation(researcherPresentation);
        entity.setM2CreateSeminarId(createSeminar.getId());
        entity.setM1ResearcherProposalId(researcherProposal);

        return entity;
    }

    @Override
    protected void convertForUpdate(FeedbackBetweenEvaAndResearcherRequestDto dto, FeedbackBetweenEvaAndResearcher entity) {

        ResearcherPresentation researcherPresentation = null;
        CreateSeminar createSeminar = null;
        ResearcherProposal researcherProposal = null;

        if (dto.getM2ResearcherPresentationId() != null) {
            researcherPresentation = researcherPresentationRepository
                    .findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
        }

        if (dto.getM2CreateSeminarId() != null) {
            createSeminar = createSeminarRepository.findByIdAndIsDeleted(dto.getM2CreateSeminarId(), false)
                    .orElse(null);
        }

        if (dto.getM1ResearcherProposalId() != null) {
            researcherProposal = researcherProposalRepository
                    .findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false).orElse(null);
        }

        entity.setResearcherPresentation(researcherPresentation);
        entity.setM2CreateSeminarId(createSeminar.getId());
        entity.setM1ResearcherProposalId(researcherProposal);

        super.convertForUpdate(dto, entity);
    }

    @Override
    public Response<FeedbackBetweenEvaAndResearcherResponseDto> update(FeedbackBetweenEvaAndResearcherRequestDto feedbackBetweenEvaAndResearcherRequestDto) {
        return (feedbackBetweenEvaAndResearcherRequestDto.getIsSent()) ?
                sendMail(feedbackBetweenEvaAndResearcherRequestDto) : super.update(feedbackBetweenEvaAndResearcherRequestDto);
    }

    private Response<FeedbackBetweenEvaAndResearcherResponseDto> sendMail(FeedbackBetweenEvaAndResearcherRequestDto feedbackBetweenEvaAndResearcherRequestDto) {

        MailRequestDto mailRequestDto = new MailRequestDto();
        mailRequestDto.setSubject(feedbackBetweenEvaAndResearcherRequestDto.getSubject());
        mailRequestDto.setBody(feedbackBetweenEvaAndResearcherRequestDto.getMailBody());
        mailRequestDto.setIsAttachment(false);
        mailRequestDto.setTemplateName("default-email-template");
        mailRequestDto.setTo(feedbackBetweenEvaAndResearcherRequestDto.getReceiverMailAddress());
        MailResponseDto mailResponseDto = mailService.sendMail(mailRequestDto);
        if (mailResponseDto != null) {
            return super.update(feedbackBetweenEvaAndResearcherRequestDto);
        }
        return getErrorResponse("Mail Save Failed");
    }

    @Override
    public Response<UserResponse> findUserByUserId(Long userId) {

        ResponseEntity<UserResponse> response = uaaClientService.getUser(userId);
        UserResponse userResponse = response.getBody();

        if (userResponse != null) {
            return new Response<>() {
                {
                    setMessage("Data Found !.");
                    setSuccess(true);
                    setObj(userResponse);
                }
            };
        }

        return getErrorResponse("Data Not Found !.");
    }

    @Override
    public Response<ExpertEvaluatorResponseDto> findEvaluatorBySeminarId(Long seminarId) {

        Optional<CreateSeminar> optional = createSeminarRepository.findByIdAndIsDeleted(seminarId, false);
        if (optional.isEmpty()) {
            getErrorResponse("Create Seminar Not Found !.");
        }

        List<CreateSeminarTimeSchedule> list = createSeminarTimeScheduleRepository
                .findAllByM2CreateSeminarIdAndIsDeleted(optional.get(), false);

        if (list != null && list.size() > 0) {
            List<LinkupProposalWithEvaluators> linkUpList = linkupProposalWithEvaluatorsRepository
                    .findAllByResearcherProposalInAndIsDeleted(list.stream().map(CreateSeminarTimeSchedule::getM1ResearcherProposalId)
                            .collect(Collectors.toCollection(HashSet::new)), false);

            if (linkUpList != null && linkUpList.size() > 0) {

                Response<ExpertEvaluatorResponseDto> response = rmsConfigurationClientService.getByExpertEvaluatorIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(linkUpList.stream().map(LinkupProposalWithEvaluators::getStProfileOfExpertEvaluatorsId)
                                .collect(Collectors.toCollection(HashSet::new)));
                    }
                });

                if (response.isSuccess() && response.getItems() != null) {

                    List<ExpertEvaluatorResponseDto> list1 = getListFromObject(response.getItems(),
                            ExpertEvaluatorResponseDto.class);
                    for (ExpertEvaluatorResponseDto l : list1) {
                        if (l.getUserId() != null) {
                            l.setUser(uaaClientService.getUser(l.getUserId()).getBody());
                        }
                    }

                    return new Response<>() {
                        {
                            setMessage("Data Found");
                            setSuccess(true);
                            setItems(list1);
                        }
                    };

                } else {
                    getErrorResponse("Linkup Proposal With Evaluators Not Found!.");
                }

            }

        } else {
            getErrorResponse("Linkup Proposal With Evaluators Not Found!.");
        }

        return getErrorResponse("Data Not Found !.");
    }

    @Override
    public Response<ExpertEvaluatorResponseDto> findEvaluatorByResearcherProposal(Long researcherProposalId) {

        Optional<ResearcherProposal> optional = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalId,
                false);
//        ExpertEvaluatorResponseDto expertEvaluatorResponseDto = new ExpertEvaluatorResponseDto();

        if (optional.isEmpty()) {
            return getErrorResponse("Researcher Proposal Not Found !.");
        }

        Optional<LinkupProposalWithEvaluators> linkUpWithEvaluatorsOptional = linkupProposalWithEvaluatorsRepository
                .findByResearcherProposalAndIsDeleted(optional.get(), false);

        if (linkUpWithEvaluatorsOptional.isPresent()) {
            Response<ExpertEvaluatorResponseDto> response = rmsConfigurationClientService
                    .getByExpertEvaluatorId(linkUpWithEvaluatorsOptional.get().getStProfileOfExpertEvaluatorsId());

            if (response.isSuccess() && response.getObj() != null) {

                ExpertEvaluatorResponseDto resData = getValueFromObject(response.getObj(),
                        ExpertEvaluatorResponseDto.class);
                resData.setUser(uaaClientService.getUser(linkUpWithEvaluatorsOptional.get().getResearcherProposal()
                        .getResearcherProfilePersonalInfoMaster().getUserId()).getBody());

                return new Response<>() {
                    {

                        setMessage("Data Found");
                        setSuccess(true);
                        setObj(resData);

                    }
                };
            }
        }
        return getErrorResponse("Data Not Found!.");
    }

}
