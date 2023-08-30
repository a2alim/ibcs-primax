package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpertEvaluatorResponseDto;
import com.ibcs.idsdp.rpm.model.domain.EvaluatorNewMemberAttendance;
import com.ibcs.idsdp.rpm.model.domain.NewMember;
import com.ibcs.idsdp.rpm.model.domain.ResearcherPresentation;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.*;
import com.ibcs.idsdp.rpm.services.EvaluatorNewMemberAttendanceService;
import com.ibcs.idsdp.rpm.web.dto.request.EvaluatorNewMemberAttendanceRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EvaluatorNewMemberAttendanceResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.NewMemberResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherPresentationResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class EvaluatorNewMemberAttendanceServiceImpl extends
        BaseService<EvaluatorNewMemberAttendance, EvaluatorNewMemberAttendanceRequestDto, EvaluatorNewMemberAttendanceResponseDto>
        implements EvaluatorNewMemberAttendanceService {

    private final EvaluatorNewMemberAttendanceRepository evaluatorNewMemberAttendanceRepository;
    private final ResearcherPresentationRepository researcherPresentationRepository;
    private final ResearcherProposalRepository researcherProposalRepository;
    private final NewMemberRepository newMemberRepository;
    private final RmsConfigurationClientService rmsConfigurationClientService;

    protected EvaluatorNewMemberAttendanceServiceImpl(ServiceRepository<EvaluatorNewMemberAttendance> repository,
                                                      EvaluatorNewMemberAttendanceRepository evaluatorNewMemberAttendanceRepository,
                                                      ResearcherPresentationRepository researcherPresentationRepository,
                                                      ResearcherProposalRepository researcherProposalRepository, NewMemberRepository newMemberRepository,
                                                      CreateSeminarRepository createSeminarRepository,
                                                      RmsConfigurationClientService rmsConfigurationClientService,
                                                      CreateSeminarTimeScheduleRepository createSeminarTimeScheduleRepository) {
        super(repository);
        this.evaluatorNewMemberAttendanceRepository = evaluatorNewMemberAttendanceRepository;
        this.researcherPresentationRepository = researcherPresentationRepository;
        this.researcherProposalRepository = researcherProposalRepository;
        this.newMemberRepository = newMemberRepository;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
    }

    @Override
    protected EvaluatorNewMemberAttendanceResponseDto convertForRead(EvaluatorNewMemberAttendance evaluatorNewMemberAttendance) {
        EvaluatorNewMemberAttendanceResponseDto responseDto = super.convertForRead(evaluatorNewMemberAttendance);

        ResearcherPresentationResponseDto researcherPresentationResponseDto = null;
        ResearcherProposalResponseDto researcherProposalResponseDto = null;
        NewMemberResponseDto newMemberResponseDto = null;

        if (evaluatorNewMemberAttendance.getResearcherPresentation() != null && evaluatorNewMemberAttendance.getResearcherPresentation().getId() != null) {
            responseDto.setM2ResearcherPresentationId(evaluatorNewMemberAttendance.getResearcherPresentation().getId());
            researcherPresentationResponseDto = new ModelMapper().map(researcherPresentationRepository
                            .findByIdAndIsDeleted(evaluatorNewMemberAttendance.getResearcherPresentation().getId(), false).orElse(null),
                    ResearcherPresentationResponseDto.class);
        }

        if (evaluatorNewMemberAttendance.getResearcherProposal() != null && evaluatorNewMemberAttendance.getResearcherProposal().getId() != null) {
            responseDto.setM1ResearcherProposalId(evaluatorNewMemberAttendance.getResearcherProposal().getId());
            researcherProposalResponseDto = new ModelMapper().map(researcherProposalRepository
                            .findByIdAndIsDeleted(evaluatorNewMemberAttendance.getResearcherProposal().getId(), false).orElse(null),
                    ResearcherProposalResponseDto.class);
        }

        if (evaluatorNewMemberAttendance.getNewMember() != null && evaluatorNewMemberAttendance.getNewMember() != null) {
            responseDto.setM2AddNewMemberId(evaluatorNewMemberAttendance.getNewMember().getId());
            newMemberResponseDto = new ModelMapper().map(
                    newMemberRepository.findByIdAndIsDeleted(evaluatorNewMemberAttendance.getNewMember().getId(), false).orElse(null),
                    NewMemberResponseDto.class);
        }

        responseDto.setResearcherPresentationResponseDto(researcherPresentationResponseDto);
        responseDto.setResearcherProposalResponseDto(researcherProposalResponseDto);
        responseDto.setNewMemberResponseDto(newMemberResponseDto);

        return responseDto;
    }

    @Override
    protected List<EvaluatorNewMemberAttendanceResponseDto> convertForRead(List<EvaluatorNewMemberAttendance> e) {
        List<EvaluatorNewMemberAttendanceResponseDto> list = super.convertForRead(e);
        if (list.isEmpty())
            return list;

        Set<Long> evaluatorIdSet = e.stream().map(EvaluatorNewMemberAttendance::getStProfileOfExpertEvaluatorsId)
                .filter(Objects::nonNull).collect(Collectors.toSet());

        Map<Long, ExpertEvaluatorResponseDto> expertEvaluatorResponseDtoMap = new HashMap<>();
        if (!evaluatorIdSet.isEmpty()) {
            expertEvaluatorResponseDtoMap = rmsConfigurationClientService
                    .getByExpertEvaluatorIdSet(new IdSetRequestBodyDTO() {
                        {
                            setIds(evaluatorIdSet);
                        }
                    }).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));
        }

        Map<Long, ExpertEvaluatorResponseDto> finalExpertEvaluatorResponseDtoMap = expertEvaluatorResponseDtoMap;
        return list.stream()
                .peek(p -> p.setExpertEvaluatorResponseDto(Objects.nonNull(p.getStProfileOfExpertEvaluatorsId())
                        ? finalExpertEvaluatorResponseDtoMap.get(p.getStProfileOfExpertEvaluatorsId())
                        : null))
                .collect(Collectors.toList());
    }

    protected EvaluatorNewMemberAttendanceResponseDto convertForRead2(EvaluatorNewMemberAttendance e) {

        EvaluatorNewMemberAttendanceResponseDto responseDto = super.convertForRead(e);

        ResearcherPresentationResponseDto researcherPresentationResponseDto = null;
        ResearcherProposalResponseDto researcherProposalResponseDto = null;
        NewMemberResponseDto newMemberResponseDto = null;

        if (e.getResearcherPresentation() != null && e.getResearcherPresentation().getId() != null) {
            responseDto.setM2ResearcherPresentationId(e.getResearcherPresentation().getId());
            researcherPresentationResponseDto = new ModelMapper().map(researcherPresentationRepository
                            .findByIdAndIsDeleted(e.getResearcherPresentation().getId(), false).orElse(null),
                    ResearcherPresentationResponseDto.class);
        }

        if (e.getResearcherProposal() != null && e.getResearcherProposal().getId() != null) {
            responseDto.setM1ResearcherProposalId(e.getResearcherProposal().getId());
            researcherProposalResponseDto = new ModelMapper().map(researcherProposalRepository
                            .findByIdAndIsDeleted(e.getResearcherProposal().getId(), false).orElse(null),
                    ResearcherProposalResponseDto.class);
        }

        if (e.getNewMember() != null && e.getNewMember() != null) {
            responseDto.setM2AddNewMemberId(e.getNewMember().getId());
            newMemberResponseDto = new ModelMapper().map(
                    newMemberRepository.findByIdAndIsDeleted(e.getNewMember().getId(), false).orElse(null),
                    NewMemberResponseDto.class);
        }

        responseDto.setResearcherPresentationResponseDto(researcherPresentationResponseDto);
        responseDto.setResearcherProposalResponseDto(researcherProposalResponseDto);
        responseDto.setNewMemberResponseDto(newMemberResponseDto);

        return responseDto;
    }

    protected EvaluatorNewMemberAttendance convertForCreate(EvaluatorNewMemberAttendanceRequestDto dto) {

        ResearcherPresentation researcherPresentation = null;
        ResearcherProposal researcherProposal = null;
        NewMember addNewMember = null;

        if (dto.getM2ResearcherPresentationId() != null) {
            researcherPresentation = researcherPresentationRepository
                    .findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
        }

        if (dto.getM1ResearcherProposalId() != null) {
            researcherProposal = researcherProposalRepository
                    .findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false).orElse(null);
        }

        if (dto.getM2AddNewMemberId() != null) {
            addNewMember = newMemberRepository.findByIdAndIsDeleted(dto.getM2AddNewMemberId(), false).orElse(null);
        }

        EvaluatorNewMemberAttendance entity = super.convertForCreate(dto);
        entity.setResearcherPresentation(researcherPresentation);
        entity.setResearcherProposal(researcherProposal);
        entity.setNewMember(addNewMember);

        return entity;
    }

    @Override
    protected void convertForUpdate(EvaluatorNewMemberAttendanceRequestDto dto, EvaluatorNewMemberAttendance entity) {

        ResearcherPresentation researcherPresentation = null;
        ResearcherProposal researcherProposal = null;
        NewMember addNewMember = null;

        if (dto.getM2ResearcherPresentationId() != null) {
            researcherPresentation = researcherPresentationRepository
                    .findByIdAndIsDeleted(dto.getM2ResearcherPresentationId(), false).orElse(null);
        }

        if (dto.getM1ResearcherProposalId() != null) {
            researcherProposal = researcherProposalRepository
                    .findByIdAndIsDeleted(dto.getM1ResearcherProposalId(), false).orElse(null);
        }

        if (dto.getM2AddNewMemberId() != null) {
            addNewMember = newMemberRepository.findByIdAndIsDeleted(dto.getM2AddNewMemberId(), false).orElse(null);
        }

        entity.setResearcherPresentation(researcherPresentation);
        entity.setResearcherProposal(researcherProposal);
        entity.setNewMember(addNewMember);
        super.convertForUpdate(dto, entity);
    }

    @Override
    public Response<EvaluatorNewMemberAttendanceResponseDto> getByUuid(@NonNull String uuid) {
        Response<EvaluatorNewMemberAttendanceResponseDto> response = super.getByUuid(uuid);
        if (response.getObj() != null) {
            if (response.getObj().getStProfileOfExpertEvaluatorsId() != null)
                response.getObj().setExpertEvaluatorResponseDto(rmsConfigurationClientService
                        .getByExpertEvaluatorId(response.getObj().getStProfileOfExpertEvaluatorsId()).getObj());
        }
        return response;
    }

    @Override
    public Response<EvaluatorNewMemberAttendanceResponseDto> getById(@NonNull Long id) {
        Response<EvaluatorNewMemberAttendanceResponseDto> response = super.getById(id);
        if (response.getObj() != null) {
            if (response.getObj().getStProfileOfExpertEvaluatorsId() != null)
                response.getObj().setExpertEvaluatorResponseDto(rmsConfigurationClientService
                        .getByExpertEvaluatorId(response.getObj().getStProfileOfExpertEvaluatorsId()).getObj());
        }
        return response;
    }

    @Override
    public Response<EvaluatorNewMemberAttendanceResponseDto> findAllByResearcherProposalId(String uuid) {

        ResearcherProposal researcherProposal = researcherProposalRepository.findByUuidAndIsDeleted(uuid, false)
                .orElse(null);

        List<EvaluatorNewMemberAttendance> responseList = new ArrayList<>();
        if (researcherProposal != null) {
            responseList = evaluatorNewMemberAttendanceRepository
                    .findAllByResearcherProposalAndIsDeleted(researcherProposal, false);
        }

//		List<EvaluatorNewMemberAttendanceResponseDto> responseDtoList = new ArrayList<EvaluatorNewMemberAttendanceResponseDto>();
//		for (EvaluatorNewMemberAttendance response : responseList) {
//			responseDtoList.add(convertForRead2(response));
//		}

        if (responseList.size() > 0) {
            Response<EvaluatorNewMemberAttendanceResponseDto> response = new Response<EvaluatorNewMemberAttendanceResponseDto>();
            response.setMessage("Data Found!.");
            response.setSuccess(true);
            response.setItems(convertForRead(responseList));
            return response;
        }

        return getErrorResponse("Data Not Found!.");
    }

    @Override
    public Response<EvaluatorNewMemberAttendanceResponseDto> getByResearcherPresentationId(Long presentationId) {

        List<EvaluatorNewMemberAttendance> list = evaluatorNewMemberAttendanceRepository
                .findAllByResearcherPresentationIdAndIsDeleted(presentationId, false);

        if (list.isEmpty())
            return getErrorResponse("Data Not Found");
        return new Response<EvaluatorNewMemberAttendanceResponseDto>() {
            {
                setMessage("Data Found");
                setItems(convertForRead(list));
            }
        };
    }

}
