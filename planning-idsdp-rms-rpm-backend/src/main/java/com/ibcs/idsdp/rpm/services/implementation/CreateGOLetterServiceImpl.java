package com.ibcs.idsdp.rpm.services.implementation;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

import javax.transaction.Transactional;

import lombok.NonNull;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.exception.ResourceNotFoundException;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.model.domain.CreateGOLetter;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.CreateGOLetterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.CreateGOLetterService;
import com.ibcs.idsdp.rpm.services.InstallmentProcessService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateGOLetterRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateGOLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.PredefineTemplateResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.TemplateTypeResponseDto;
import com.ibcs.idsdp.util.Response;

import lombok.extern.slf4j.Slf4j;

@Slf4j
@Service
@Transactional
public class CreateGOLetterServiceImpl extends BaseService<CreateGOLetter, CreateGOLetterRequestDto, CreateGOLetterResponseDto> implements CreateGOLetterService {

    private final CreateGOLetterRepository createGOLetterRepository;
    private final ResearcherProposalRepository researcherProposalRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final InstallmentProcessService installmentProcessService;
    private final RmsConfigurationClientService rmsConfigurationClientService;

    protected CreateGOLetterServiceImpl(ServiceRepository<CreateGOLetter> repository,
                                        CreateGOLetterRepository createGOLetterRepository,
                                        ResearcherProposalRepository researcherProposalRepository,
                                        IdGeneratorComponent idGeneratorComponent,
                                        InstallmentProcessService installmentProcessService,
                                        RmsConfigurationClientService rmsConfigurationClientService) {
        super(repository);
        this.createGOLetterRepository = createGOLetterRepository;
        this.researcherProposalRepository = researcherProposalRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.installmentProcessService = installmentProcessService;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
    }

    @Override
    public Response<CreateGOLetterResponseDto> save(CreateGOLetterRequestDto createGOLetterRequestDto) {
        Response<CreateGOLetterResponseDto> response = new Response<>();
        CreateGOLetter cgl = new CreateGOLetter();

        if (createGOLetterRequestDto.getId() != null) {
            Optional<CreateGOLetter> result = createGOLetterRepository.findById(createGOLetterRequestDto.getId());
            if (!result.isPresent()) throw new ResourceNotFoundException("GO Letter Not Found");
            cgl = result.get();
        }

        BeanUtils.copyProperties(createGOLetterRequestDto, cgl, "goCode", "id", "uuid");

        // create go code
        if (cgl.getId() == null) {
            if (StringUtils.isBlank(cgl.getGoCode())) {
                String sequencecode = createGOLetterRepository.getNextGOCode();
                sequencecode = StringUtils.leftPad(sequencecode, 8, "0");
                cgl.setGoCode(sequencecode);
            }
            cgl.setUuid(idGeneratorComponent.generateUUID());
        } else {
            cgl.setUpdatedBy("admin");
            cgl.setUpdatedOn(LocalDate.now());
        }
        cgl.setCreatedBy("zubayer");
        cgl.setCreatedOn(LocalDate.now());
        cgl.setIsDeleted(false);

        Optional<ResearcherProposal> researcherProposalOptional = researcherProposalRepository.findById(createGOLetterRequestDto.getResearcherProposalId());
        if (!researcherProposalOptional.isPresent()) {
            throw new ResourceNotFoundException("Researcher Proposal Not Found");
        }
       // cgl.setResearcherProposalId(researcherProposalOptional.get());

        try {
            createGOLetterRepository.save(cgl);
        } catch (Exception e) {
            log.error("ERROR is : {}, {}", e.getMessage(), e);
            response.setSuccess(false);
            response.setMessage("Can't create GO Latter");
            response.setObj(null);
            return response;
        }

        CreateGOLetterResponseDto responseDto = new CreateGOLetterResponseDto();
        BeanUtils.copyProperties(cgl, responseDto);
        response.setSuccess(true);
        response.setMessage("GO Latter Created Successfully");
        response.setObj(responseDto);
        return response;
    }

    @Override
    public Response<CreateGOLetterResponseDto> findById(Long id) {
        Response<CreateGOLetterResponseDto> response = this.getById(id);

        CreateGOLetterResponseDto dto = response.getObj();
        if (dto == null || dto.getInstallmentProcessId() == null) return response;

        Response<InstallmentProcessResponseDto> installmentProcessRes = installmentProcessService.getInstallmentProcessById(dto.getInstallmentProcessId());
        if (installmentProcessRes != null) {
            dto.setInstallmentProcess(installmentProcessRes.getObj());
        }

        // Template Type
        Response<TemplateTypeResponseDto> templateTypeResponse = rmsConfigurationClientService.getTemplateTypeById(dto.getTemplateTypeId());
        if (templateTypeResponse != null) {
            dto.setTemplateType(templateTypeResponse.getObj());
        }

        // Predefined template
        Response<PredefineTemplateResponseDto> predeifnedtempalteResponse = rmsConfigurationClientService.getPredefinedTempalteById(dto.getPredefinedTemplateId());
        if (predeifnedtempalteResponse != null) {
            dto.setPredefineTemplate(predeifnedtempalteResponse.getObj());
        }

        return response;
    }

    @Override
    public Page<CreateGOLetterResponseDto> getAllGoLetter(CreateGOLetterRequestDto createGOLetterRequestDto) {
        Pageable pageable = this.getPageable(createGOLetterRequestDto.getPageableRequestBodyDTO());
        Page<CreateGOLetter> ePage = createGOLetterRepository.findAllCreateGOLetterByIsDeleted(false, pageable);
        List<CreateGOLetterResponseDto> list = convertForRead(ePage.getContent());

        for (CreateGOLetterResponseDto dto : list) {
            Response<InstallmentProcessResponseDto> installmentProcessRes = installmentProcessService.getInstallmentProcessById(dto.getInstallmentProcessId());
            if (installmentProcessRes != null) {
                dto.setInstallmentProcess(installmentProcessRes.getObj());
            }

            // Template Type
            Response<TemplateTypeResponseDto> templateTypeResponse = rmsConfigurationClientService.getTemplateTypeById(dto.getTemplateTypeId());
            if (templateTypeResponse != null) {
                dto.setTemplateType(templateTypeResponse.getObj());
            }

            // Predefined template
            Response<PredefineTemplateResponseDto> predeifnedtempalteResponse = rmsConfigurationClientService.getPredefinedTempalteById(dto.getPredefinedTemplateId());
            if (predeifnedtempalteResponse != null) {
                dto.setPredefineTemplate(predeifnedtempalteResponse.getObj());
            }
        }

        return new PageImpl<>(list, pageable, ePage.getTotalElements());
    }

    @Override
    public void update(String uid, CreateGOLetterRequestDto dto) {

        CreateGOLetter createGOLetter = createGOLetterRepository.findByUuid(uid)
                .orElseThrow(() -> new IllegalArgumentException(String
                        .format("CO letter not found with id [%s]", uid)));
        createGOLetter.setGoCode(Objects.nonNull(dto.getGoCode()) ? dto.getGoCode() : null);

        ResearcherProposal researcherProposal;

        if(Objects.nonNull(dto.getResearcherProposalId())) {
            researcherProposal = researcherProposalRepository
                    .findById(dto.getResearcherProposalId())
                    .orElseThrow(()-> new IllegalArgumentException(String
                            .format("ResearcherProposal not found with id [%s]", dto.getResearcherProposalId())));

           // createGOLetter.setResearcherProposalId(researcherProposal);
        }


		createGOLetter.setInstallmentProcessId(Objects.nonNull(dto.getInstallmentProcessId()) ? dto.getInstallmentProcessId() : null);
		//createGOLetter.setInstallmentTypeId(Objects.nonNull(dto.getInstallmentTypeId()) ? dto.getInstallmentTypeId() : null);
		createGOLetter.setFiscalYearId(Objects.nonNull(dto.getFiscalYearId()) ? dto.getFiscalYearId(): null);
		createGOLetter.setResearchCatTypeId(Objects.nonNull(dto.getResearchCatTypeId()) ? dto.getResearchCatTypeId(): null);
		createGOLetter.setTotalAmount(Objects.nonNull(dto.getTotalAmount()) ? dto.getTotalAmount(): null);
		createGOLetter.setIsSend(Objects.nonNull(dto.getIsSend()) ? dto.getIsSend(): false);
		createGOLetter.setSubject(Objects.nonNull(dto.getSubject()) ? dto.getSubject(): null);
		createGOLetter.setMailBody(Objects.nonNull(dto.getMailBody()) ? dto.getMailBody(): null);
        /*
        * as instructed By Bul bul Da
        * Added By Rakibul Hasan
        * */
        createGOLetter.setApprovedStatus(Objects.nonNull(dto.getApprovedStatus()) ? dto.getApprovedStatus(): null);
        createGOLetter.setEnothiNumber(Objects.nonNull(dto.getEnothiNumber()) ? dto.getEnothiNumber(): null);
        createGOLetter.setBnDate(Objects.nonNull(dto.getBnDate()) ? dto.getBnDate(): null);
        createGOLetter.setEnDate(Objects.nonNull(dto.getEnDate()) ? dto.getEnDate(): null);
        /**/
		//createGOLetter.setTemplateTypeId(Objects.nonNull(dto.getTemplateTypeId()) ? dto.getTemplateTypeId(): null);
		//createGOLetter.setPredefinedTemplateId(Objects.nonNull(dto.getPredefinedTemplateId()) ? dto.getPredefinedTemplateId(): null);
		createGOLetter.setUpdatedOn(LocalDate.now());
		createGOLetter.setUpdatedBy("admin");

		createGOLetterRepository.save(createGOLetter);

    }



    @Override
    public CreateGOLetterResponseDto getGoByUuid(String uuid) {
        CreateGOLetterResponseDto dto = super.getByUuid(uuid).getObj();
//        List<CreateGOLetterResponseDto> list=new ArrayList<>();
//        list.add(obj);

            Response<InstallmentProcessResponseDto> installmentProcessRes = installmentProcessService.getInstallmentProcessById(dto.getInstallmentProcessId());
            if (installmentProcessRes != null) {
                dto.setInstallmentProcess(installmentProcessRes.getObj());
            }

            // Template Type
            Response<TemplateTypeResponseDto> templateTypeResponse = rmsConfigurationClientService.getTemplateTypeById(dto.getTemplateTypeId());
            if (templateTypeResponse != null) {
                dto.setTemplateType(templateTypeResponse.getObj());
            }

            // Predefined template
            Response<PredefineTemplateResponseDto> predeifnedtempalteResponse = rmsConfigurationClientService.getPredefinedTempalteById(dto.getPredefinedTemplateId());
            if (predeifnedtempalteResponse != null) {
                dto.setPredefineTemplate(predeifnedtempalteResponse.getObj());
            }

        return  dto;
    }

    @Override
    public Response<CreateGOLetterResponseDto> deleteById(Long id) {
        Response<CreateGOLetterResponseDto> response = new Response<>();
        try {
            Optional<CreateGOLetter> result = createGOLetterRepository.findById(id);
            if (!result.isPresent()) throw new ResourceNotFoundException("GO Letter Not Found");

            CreateGOLetter cgl = result.get();
            cgl.setIsDeleted(true);
            cgl.setUpdatedBy("admin");
            cgl.setUpdatedOn(LocalDate.now());
            createGOLetterRepository.save(cgl);

            CreateGOLetterResponseDto responseDto = new CreateGOLetterResponseDto();
            BeanUtils.copyProperties(cgl, responseDto);
            response.setSuccess(true);
            response.setMessage("GO Letter Deleted Successfully");
            response.setObj(responseDto);
            return response;
        } catch (Exception e) {
            log.error("ERROR is : {},  {}", e.getMessage(), e);
            response.setSuccess(false);
            response.setMessage("Can't delete GO Letter");
            response.setObj(null);
            return response;
        }
    }


}
