package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposalMarks;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalMarksRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProposalMarksService;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalMarksRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalMarksResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class ResearcherProposalMarksServiceImpl extends
        BaseService<ResearcherProposalMarks, ResearcherProposalMarksRequestDto, ResearcherProposalMarksResponseDto>
        implements ResearcherProposalMarksService {

    private final ResearcherProposalMarksRepository repository;
    private final ResearcherProposalRepository researcherProposalRepository;

    protected ResearcherProposalMarksServiceImpl(ServiceRepository<ResearcherProposalMarks> repository, ResearcherProposalMarksRepository repository1, ResearcherProposalRepository researcherProposalRepository) {
        super(repository);
        this.repository = repository1;
        this.researcherProposalRepository = researcherProposalRepository;
    }

    @Override
    protected ResearcherProposalMarks convertForCreate(ResearcherProposalMarksRequestDto researcherProposalMarksRequestDto) {
        ResearcherProposalMarks researcherProposalMarks = super.convertForCreate(researcherProposalMarksRequestDto);
        Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalMarksRequestDto.getResearcherProposalId(), false);
        if (researcherProposal.isEmpty()) {
            log.info("Researcher Personal not found");
            throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
        }
        researcherProposalMarks.setResearcherProposal(researcherProposal.get());
        researcherProposalMarks.setTotalMarks(researcherProposalMarksRequestDto.getMarkOne() + researcherProposalMarksRequestDto.getMarkTwo() +
                researcherProposalMarksRequestDto.getMarkThree() + researcherProposalMarksRequestDto.getMarkFour() + researcherProposalMarksRequestDto.getMarkFive() +
                researcherProposalMarksRequestDto.getMarkSix() + researcherProposalMarksRequestDto.getMarkSeven() + researcherProposalMarksRequestDto.getMarkEight() +
                researcherProposalMarksRequestDto.getMarkNine() + researcherProposalMarksRequestDto.getMarkTen());
        return researcherProposalMarks;
    }

    @Override
    protected void convertForUpdate(ResearcherProposalMarksRequestDto researcherProposalMarksRequestDto, ResearcherProposalMarks researcherProposalMarks) {
        Optional<ResearcherProposal> researcherProposal = researcherProposalRepository.findByIdAndIsDeleted(researcherProposalMarksRequestDto.getResearcherProposalId(), false);
        if (researcherProposal.isEmpty()) {
            log.info("Researcher Personal not found");
            throw new ServiceExceptionHolder.InvalidRequestException("Researcher Personal not found");
        }
        researcherProposalMarks.setResearcherProposal(researcherProposal.get());
        researcherProposalMarks.setTotalMarks(researcherProposalMarksRequestDto.getMarkOne() + researcherProposalMarksRequestDto.getMarkTwo() +
                researcherProposalMarksRequestDto.getMarkThree() + researcherProposalMarksRequestDto.getMarkFour() + researcherProposalMarksRequestDto.getMarkFive() +
                researcherProposalMarksRequestDto.getMarkSix() + researcherProposalMarksRequestDto.getMarkSeven() + researcherProposalMarksRequestDto.getMarkEight() +
                researcherProposalMarksRequestDto.getMarkNine() + researcherProposalMarksRequestDto.getMarkTen());
        super.convertForUpdate(researcherProposalMarksRequestDto, researcherProposalMarks);
    }

    @Override
    protected ResearcherProposalMarksResponseDto convertForRead(ResearcherProposalMarks researcherProposalMarks) {
        ResearcherProposalMarksResponseDto dto = super.convertForRead(researcherProposalMarks);
        dto.setResearcherProposalId(researcherProposalMarks.getResearcherProposal().getId());
        dto.setResearcherProposalDto(new ModelMapper().map(researcherProposalMarks.getResearcherProposal(), ResearcherProposalResponseDto.class));
        return dto;
    }

    @Override
    public Response<ResearcherProposalMarksResponseDto>  create(ResearcherProposalMarksRequestDto researcherProposalMarksRequestDto) {
//        if (repository.existsByResearcherProposalIdAndIsDeleted(researcherProposalMarksRequestDto.getResearcherProposalId(), false)) {
//            deleteEntity(repository.findByResearcherProposalIdAndIsDeleted(researcherProposalMarksRequestDto.getResearcherProposalId(), false).getUuid());
//        }
        return super.create(researcherProposalMarksRequestDto);
    }

    @Override
    public Response<ResearcherProposalMarksResponseDto> getByResearcherProposalId(Long id) {
        List<ResearcherProposalMarks> list = repository.findAllByResearcherProposalIdAndIsDeleted(id, false);
        if (list.isEmpty()) {
            return new Response<>() {{
                setSuccess(true);
                setMessage("List is empty");
            }};
        }
        return new Response<>() {{
            setMessage("Data Found");
            setItems(convertForRead(list));
        }};
    }

    @Transactional
    @Override
    public Response<ResearcherProposalMarksResponseDto> saveList(List<ResearcherProposalMarksRequestDto> request) {
        try {
            List<ResearcherProposalMarksResponseDto> list = new ArrayList<>();
            request.forEach(e -> {
                if (e.getUuid() != null) {
                    list.add(update(e).getObj());
                } else {
                    list.add(create(e).getObj());
                }
            });
            return new Response<>() {{
                setSuccess(true);
                setItems(list);
            }};
        } catch (Exception e) {
            e.printStackTrace();
            log.error("Data not Saved");
            return getErrorResponse("Save Failed");
        }
    }
}
