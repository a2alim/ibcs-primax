package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.services.MinioServerService;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.FileUploadResponse;
import com.ibcs.idsdp.rpm.model.domain.EnothiApprovalFiles;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.EnothiApprovalFilesRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.EnothiApprovalFilesService;
import com.ibcs.idsdp.rpm.web.dto.request.EnothiApprovalFilesRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.eNothi.PagableRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.eNothi.SendToEnothiRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.EnothiApprovalFilesResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.eNothi.EnothiResearcherProposalResponseDto;
import com.ibcs.idsdp.util.Response;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class EnothiApprovalFilesServiceImpl extends BaseService<EnothiApprovalFiles, EnothiApprovalFilesRequestDto, EnothiApprovalFilesResponseDto> implements EnothiApprovalFilesService {

    private final EnothiApprovalFilesRepository enothiApprovalFilesRepository;
    private final MinioServerService minioServerService;
     private final RmsConfigurationClientService  rmsConfigurationClientService;

     private final ResearcherProposalRepository researcherProposalRepository;

    public EnothiApprovalFilesServiceImpl(ServiceRepository<EnothiApprovalFiles> repository, EnothiApprovalFilesRepository enothiApprovalFilesRepository, MinioServerService minioServerService, RmsConfigurationClientService rmsConfigurationClientService, ResearcherProposalRepository researcherProposalRepository) {
        super(repository);
        this.enothiApprovalFilesRepository = enothiApprovalFilesRepository;
        this.minioServerService = minioServerService;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
        this.researcherProposalRepository = researcherProposalRepository;
    }

    public Response<EnothiApprovalFilesResponseDto> dataSave(Optional<MultipartFile[]> files, String body) {
        EnothiApprovalFiles enothiApprovalFiles = new EnothiApprovalFiles();
        EnothiApprovalFilesRequestDto enothiApprovalFilesRequestDto = new Gson().fromJson(body, EnothiApprovalFilesRequestDto.class);

        long countVal = 0;
        if (enothiApprovalFilesRequestDto.getDataFor().equalsIgnoreCase("rms-proposal")) {
            countVal = enothiApprovalFilesRepository.countByStFiscalYearIdAndStResearchCategoryTypeIdAndDataForAndIsDeleted(enothiApprovalFilesRequestDto.getStFiscalYearId(), enothiApprovalFilesRequestDto.getStResearchCategoryTypeId(),  enothiApprovalFilesRequestDto.getDataFor(), false);
        }
        if (enothiApprovalFilesRequestDto.getDataFor().equalsIgnoreCase("researcher-agreement")) {
            countVal = enothiApprovalFilesRepository.countByStFiscalYearIdAndM1ResearcherProposalUuidAndDataForAndIsDeleted(enothiApprovalFilesRequestDto.getStFiscalYearId(), enothiApprovalFilesRequestDto.getM1ResearcherProposalUuid(),  enothiApprovalFilesRequestDto.getDataFor(), false);
        }

        if (countVal < 1) {
            BeanUtils.copyProperties(enothiApprovalFilesRequestDto, enothiApprovalFiles);

            FileUploadResponse profilePicDetails = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
            enothiApprovalFilesRequestDto.setBucketName(profilePicDetails.getBucketName());
            enothiApprovalFilesRequestDto.setFileName(profilePicDetails.getFileName());
            enothiApprovalFilesRequestDto.setFileDownloadUrl(profilePicDetails.getDownloadUrl());

            return create(enothiApprovalFilesRequestDto);
        }
        return getErrorResponse("Already Exist!.");
    }

    public Response<EnothiApprovalFilesResponseDto> dataUpdate(Optional<MultipartFile[]> files, String body) {

        EnothiApprovalFilesRequestDto requestData = new Gson().fromJson(body, EnothiApprovalFilesRequestDto.class);
        EnothiApprovalFilesRequestDto enothiApprovalFilesRequestDto = new EnothiApprovalFilesRequestDto();

        Optional<EnothiApprovalFiles> val = enothiApprovalFilesRepository.findByUuidAndIsDeleted(requestData.getUuid(), false);
        if (val.isPresent()) {
            BeanUtils.copyProperties(val.get(), enothiApprovalFilesRequestDto);

            enothiApprovalFilesRequestDto.setSubject(requestData.getSubject());
            enothiApprovalFilesRequestDto.setInternalApproval(requestData.getInternalApproval());
            enothiApprovalFilesRequestDto.setInternalApproval(requestData.getInternalApproval());
            enothiApprovalFilesRequestDto.setNote(requestData.getNote());
            enothiApprovalFilesRequestDto.setDataFor(requestData.getDataFor());
            enothiApprovalFilesRequestDto.setIsSent(requestData.getIsSent());
            enothiApprovalFilesRequestDto.setM1ResearcherProposalUuid(requestData.getM1ResearcherProposalUuid());

            if((requestData.getIsSent() !=null && requestData.getIsSent().equals(true)) && val.get().getSendingDate() !=null)
            {
                enothiApprovalFilesRequestDto.setSendingDate(LocalDate.now());
            }

            enothiApprovalFilesRequestDto.setDakReceivedNo(requestData.getDakReceivedNo());
            enothiApprovalFilesRequestDto.setDakId(requestData.getDakId());
            enothiApprovalFilesRequestDto.setCurrentDeskId(requestData.getCurrentDeskId());

            if (files.isPresent()) {
                FileUploadResponse profilePicDetails = minioServerService.getFileDownloadUrl(files.get()[0], "rms");
                enothiApprovalFilesRequestDto.setBucketName(profilePicDetails.getBucketName());
                enothiApprovalFilesRequestDto.setFileName(profilePicDetails.getFileName());
                enothiApprovalFilesRequestDto.setFileDownloadUrl(profilePicDetails.getDownloadUrl());
            }
            return update(enothiApprovalFilesRequestDto);
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<EnothiApprovalFilesResponseDto> sendToEnothi(SendToEnothiRequestDto sendToEnothiRequestDto) {
        return null;
    }

    @Override
    protected List<EnothiApprovalFilesResponseDto> convertForRead(List<EnothiApprovalFiles> enothiApprovalFiles) {
        List<EnothiApprovalFilesResponseDto> list = super.convertForRead(enothiApprovalFiles);
        return list;
    }

    public Response<EnothiApprovalFilesResponseDto> getNothiApprovalList(PagableRequestDto requestDto) {

        Page<EnothiApprovalFiles> ePage = null;
        Response<EnothiApprovalFilesResponseDto> response = new Response();
        Pageable pageable = this.getPageable(requestDto.getPageableRequestBodyDTO());

        if (requestDto.getStFiscalYearId() != null && requestDto.getStResearchCategoryTypeId() == null) {
            ePage = enothiApprovalFilesRepository.findAllByStFiscalYearIdAndDataForAndIsDeletedOrderByIdDesc(requestDto.getStFiscalYearId(), requestDto.getDataFor(), false, getPageable(requestDto.getPageableRequestBodyDTO()));
        }
        if (requestDto.getStResearchCategoryTypeId() != null && requestDto.getStFiscalYearId() == null) {
            ePage = enothiApprovalFilesRepository.findAllByStResearchCategoryTypeIdAndDataForAndIsDeletedOrderByIdDesc(requestDto.getStResearchCategoryTypeId(), requestDto.getDataFor(), false, getPageable(requestDto.getPageableRequestBodyDTO()));
        }
        if (requestDto.getStFiscalYearId() != null && requestDto.getStResearchCategoryTypeId() != null) {
            ePage = enothiApprovalFilesRepository.findAllByStFiscalYearIdAndStResearchCategoryTypeIdAndDataForAndIsDeletedOrderByIdDesc(requestDto.getStFiscalYearId(), requestDto.getStResearchCategoryTypeId(), requestDto.getDataFor(), false, getPageable(requestDto.getPageableRequestBodyDTO()));

        }
        if (requestDto.getStFiscalYearId() == null && requestDto.getStResearchCategoryTypeId() == null) {
            ePage = enothiApprovalFilesRepository.findAllByDataForAndIsDeletedOrderByIdDesc(requestDto.getDataFor(), false, getPageable(requestDto.getPageableRequestBodyDTO()));
        }

        if (!CollectionUtils.isEmpty(ePage.getContent())) {
            response.setPage(new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements()));
            return getSuccessResponse("Data found ", response);
        }
            return new Response<>() {
                {
                    setMessage("Data not found");
                    setSuccess(false);
                }
            };
    }

    public Response<EnothiResearcherProposalResponseDto> getResearcherProposalObjectByUuid(String proposalUuid){
        Optional<ResearcherProposal> optional = researcherProposalRepository.findByUuidAndIsFinalSubmitAndIsDeleted(proposalUuid,  true,false);
        if(optional.isPresent())
        {
            return new Response<EnothiResearcherProposalResponseDto>() {
                {
                    setMessage("Data found");
                    setObj(new ModelMapper().map(optional.get(), EnothiResearcherProposalResponseDto.class));
//                    setObj(new EnothiResearcherProposalResponseDto(){{
//                        setResearchTitle(optional.get().getResearchTitle());
//                        setResearchTitleBangla(optional.get().getResearchTitleBangla());
//                    }});
                }
            };
        }
        return getErrorResponse("Already Exist!.");
    }

}
