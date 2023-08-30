package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.client.dto.response.*;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.domain.ViewResearcherList;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfilePersonalInfoMasterRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.model.repositories.ViewResearcherRepository;
import com.ibcs.idsdp.rpm.services.*;
import com.ibcs.idsdp.rpm.web.dto.request.ResearcherProposalRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.*;
import com.ibcs.idsdp.rpm.web.dto.response.sectorSubSectorSelection.AgreementInstallmentResponseDto;
import com.ibcs.idsdp.util.Response;
import lombok.NonNull;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;

import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ResearcherProposalServiceImpl
        extends BaseService<ResearcherProposal, ResearcherProposalRequestDto, ResearcherProposalResponseDto>
        implements ResearcherProposalService {

    private final ResearcherProposalRepository repository;
    private final ResearcherProposalInfoService researcherProposalInfoService;
    private final ResearcherProposalInstituteInfoService researcherProposalInstituteInfoService;
    private final ResearcherProposalRscWorkingInOrgService researcherProposalRscWorkingInOrgService;
    private final ResearcherProposalUploadDocService researcherProposalUploadDocService;
    private final ResearcherSupervisorInfoService researcherSupervisorInfoService;
    private final ResearcherProposalActionPlanService researcherProposalActionPlanService;
    private final ResearcherProposalBudgetDetailsService researcherProposalBudgetDetailsService;
    private final ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository;
    private final RmsConfigurationClientService rmsConfigurationClientService;
    private final UaaClientService uaaClientService;
    private final ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService;
    private final AgreementWithResearcherService agreementWithResearcherService;
    private final AgreementInstallmentService agreementInstallmentService;
    private final ViewResearcherRepository viewResearcherRepository;
    Logger logger = LoggerFactory.getLogger(ResearcherProposalServiceImpl.class);
    @Autowired
    private ResearcherPresentationService researcherPresentationService;


    protected ResearcherProposalServiceImpl(ServiceRepository<ResearcherProposal> researcherProposalRepository,
                                            ResearcherProposalRepository repository1, ResearcherProposalInfoService researcherProposalInfoService,
                                            ResearcherProposalInstituteInfoService researcherProposalInstituteInfoService,
                                            ResearcherProposalRscWorkingInOrgService researcherProposalRscWorkingInOrgService,
                                            ResearcherProposalUploadDocService researcherProposalUploadDocService,
                                            ResearcherSupervisorInfoService researcherSupervisorInfoService,
                                            ResearcherProposalActionPlanService researcherProposalActionPlanService,
                                            ResearcherProposalBudgetDetailsService researcherProposalBudgetDetailsService,
                                            ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository,
                                            RmsConfigurationClientService rmsConfigurationClientService, UaaClientService uaaClientService,
                                            ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService,
                                            AgreementWithResearcherService agreementWithResearcherService,
                                            AgreementInstallmentService agreementInstallmentService, ViewResearcherRepository viewResearcherRepository) {
        super(researcherProposalRepository);
        this.repository = repository1;
        this.researcherProposalInfoService = researcherProposalInfoService;
        this.researcherProposalInstituteInfoService = researcherProposalInstituteInfoService;
        this.researcherProposalRscWorkingInOrgService = researcherProposalRscWorkingInOrgService;
        this.researcherProposalUploadDocService = researcherProposalUploadDocService;
        this.researcherSupervisorInfoService = researcherSupervisorInfoService;
        this.researcherProposalActionPlanService = researcherProposalActionPlanService;
        this.researcherProposalBudgetDetailsService = researcherProposalBudgetDetailsService;
        this.researcherProfilePersonalInfoMasterRepository = researcherProfilePersonalInfoMasterRepository;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
        this.uaaClientService = uaaClientService;
        this.researcherProfilePersonalInfoMasterService = researcherProfilePersonalInfoMasterService;
        this.agreementWithResearcherService = agreementWithResearcherService;
        this.agreementInstallmentService = agreementInstallmentService;
        this.viewResearcherRepository = viewResearcherRepository;
    }

    public void test() {
        Response<ResearcherProposalResponseDto> byUuid = super.getByUuid("44e34658-04b1-4de9-89a2-a346d82327a5");
    }

    @Override
    protected ResearcherProposal convertForCreate(ResearcherProposalRequestDto researcherProposalRequestDto) {
        ResearcherProposal researcherProposal = super.convertForCreate(researcherProposalRequestDto);
        Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterRepository
                .findByIdAndIsDeleted(researcherProposalRequestDto.getResProfilePersonalInfoId(), false);
        if (researcherProfilePersonalInfoMaster.isEmpty()) {
            log.info("Researcher Profile Personal Info not found");
            throw new ServiceExceptionHolder.InvalidRequestException("Researcher Profile Personal Info not found");
        }
        researcherProposal.setResearcherProfilePersonalInfoMaster(researcherProfilePersonalInfoMasterRepository
                .findByIdAndIsDeleted(researcherProposalRequestDto.getResProfilePersonalInfoId(), false).get());
        return researcherProposal;
    }

    /*
     * Test
     * */
    @Override
    protected void convertForUpdate(ResearcherProposalRequestDto researcherProposalRequestDto,                              ResearcherProposal researcherProposal) {
        Optional<ResearcherProfilePersonalInfoMaster> researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterRepository
                .findByIdAndIsDeleted(researcherProposalRequestDto.getResProfilePersonalInfoId(), false);
        if (researcherProfilePersonalInfoMaster.isEmpty()) {
            log.info("Researcher Profile Personal Info not found");
            throw new ServiceExceptionHolder.InvalidRequestException("Researcher Profile Personal Info not found");
        }
        researcherProposal.setResearcherProfilePersonalInfoMaster(researcherProfilePersonalInfoMasterRepository
                .findByIdAndIsDeleted(researcherProposalRequestDto.getResProfilePersonalInfoId(), false).get());
        super.convertForUpdate(researcherProposalRequestDto, researcherProposal);
    }

    @Override
    protected ResearcherProposalResponseDto convertForRead(ResearcherProposal researcherProposal) {
        ResearcherProposalResponseDto dto = super.convertForRead(researcherProposal);

        dto.setResProfilePersonalInfoId(researcherProposal.getResearcherProfilePersonalInfoMaster().getId());
        dto.setResearcherProfilePersonalInfoDto(
                new ModelMapper().map(researcherProposal.getResearcherProfilePersonalInfoMaster(),
                        ResearcherProfilePersonalInfoMasterResponse.class));
        return dto;
    }

    @Override
    protected List<ResearcherProposalResponseDto> convertForRead(List<ResearcherProposal> e) {
        List<ResearcherProposalResponseDto> list = super.convertForRead(e);
        if (list.isEmpty()) {
            return list;
        }

        Map<Long, ResearchCategoryTypeResponseDto> researchCategoryTypeResponseDtoMap = rmsConfigurationClientService
                .getByResearchCategoryTypeByIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(list.stream().map(ResearcherProposalResponseDto::getStResearchCatTypeId)
                                .collect(Collectors.toSet()));
                    }
                }).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

        Map<Long, FiscalResponseDto> fiscalResponseResponseDtoMap = rmsConfigurationClientService
                .getByFiscalYearIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(list.stream().map(ResearcherProposalResponseDto::getStFiscalYearId)
                                .collect(Collectors.toSet()));
                    }
                }).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

        Map<Long, SectorTypeResponseDto> sectorTypeResponseDtoMap = rmsConfigurationClientService
                .getBySectorTypeByIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(list.stream().map(ResearcherProposalResponseDto::getStSectorTypeId)
                                .collect(Collectors.toSet()));
                    }
                }).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

        Map<Long, SubSectorResponseDto> subSectorResponseDtoMap = rmsConfigurationClientService
                .getBySubSectorByIdSet(new IdSetRequestBodyDTO() {
                    {
                        setIds(list.stream().map(ResearcherProposalResponseDto::getStSubSectorsId)
                                .collect(Collectors.toSet()));
                    }
                }).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));

        Map<Long, UserResponse> userResponseMap = Objects.requireNonNull(uaaClientService.getUserByIdSet(
                        list.stream().map(m -> m.getResearcherProfilePersonalInfoDto().getUserId()).collect(Collectors.toSet()))
                .getBody()).stream().collect(Collectors.toMap(UserResponse::getId, dto -> dto));

        return list.stream().peek(p -> {
            p.setResearchCategoryType(researchCategoryTypeResponseDtoMap.get(p.getStResearchCatTypeId()));
            p.setFiscalYear(fiscalResponseResponseDtoMap.get(p.getStFiscalYearId()));
            p.setSector(sectorTypeResponseDtoMap.get(p.getStSectorTypeId()));
            p.setSubSector(subSectorResponseDtoMap.get(p.getStSubSectorsId()));
            p.getResearcherProfilePersonalInfoDto()
                    .setUserDto(userResponseMap.get(p.getResearcherProfilePersonalInfoDto().getUserId()));
            p.setResearcherSupervisorInfoResponseDto(
                    researcherSupervisorInfoService.getByResearcherProposalId(p.getId()).getObj());
        }).collect(Collectors.toList());
    }

    @Override
    public Response<ResearcherProposalResponseDto> getById(@NonNull Long id) {
        Response<ResearcherProposalResponseDto> res = super.getById(id);
        if (res.isSuccess()) {
            res.getObj().setFiscalYear(
                    rmsConfigurationClientService.getByFiscalYearId(res.getObj().getStFiscalYearId()).getObj());
            res.getObj().setResearchCategoryType(rmsConfigurationClientService
                    .getByResearchCategoryTypeId(res.getObj().getStResearchCatTypeId()).getObj());
            res.getObj().getResearcherProfilePersonalInfoDto().setUserDto(
                    uaaClientService.getUser(res.getObj().getResearcherProfilePersonalInfoDto().getUserId()).getBody());
        }
        return res;
    }

    @Override
    public Response<ResearcherProposalResponseDto> getByUuid(@NonNull String uuid) {
        Response<ResearcherProposalResponseDto> res = super.getByUuid(uuid);
        if (res.isSuccess()) {
            res.getObj().setFiscalYear(
                    rmsConfigurationClientService.getByFiscalYearId(res.getObj().getStFiscalYearId()).getObj());
            res.getObj().setResearchCategoryType(rmsConfigurationClientService
                    .getByResearchCategoryTypeId(res.getObj().getStResearchCatTypeId()).getObj());
            res.getObj().getResearcherProfilePersonalInfoDto().setUserDto(
                    uaaClientService.getUser(res.getObj().getResearcherProfilePersonalInfoDto().getUserId()).getBody());

        }
        return res;
    }

    @Override
    public Response<ResearcherProposalDetailsResponseDto> getResearcherProposalDetailsByUuid(
            String researcherProposalUuid) {

        ResearcherProposalDetailsResponseDto response = new ResearcherProposalDetailsResponseDto();

//        ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = researcherProfilePersonalInfoMasterRepository.findByUuidAndIsDeleted(researcherProfileInfoUuid, false).get();
//        ResearcherProposal researcherProposal = repository.findByResProfilePersonalInfoIdAndIsDeleted(10182021l, false);
        Optional<ResearcherProposal> researcherProposal = repository.findByUuidAndIsDeleted(researcherProposalUuid,
                false);

        if (researcherProposal.isEmpty()) {
            return getErrorResponse("Research Proposal not Found By Research Profile Personal Info ID");
        }

        response.setResearcherProposal(convertForRead(researcherProposal.get()));
        response.getResearcherProposal().getResearcherProfilePersonalInfoDto().setUserDto(uaaClientService
                .getUser(response.getResearcherProposal().getResearcherProfilePersonalInfoDto().getUserId()).getBody());

        response.getResearcherProposal().setFiscalYear(
                rmsConfigurationClientService.getByFiscalYearId(researcherProposal.get().getStFiscalYearId()).getObj());
        response.getResearcherProposal().setSector(
                rmsConfigurationClientService.getBySectorTypeId(researcherProposal.get().getStSectorTypeId()).getObj());
        response.getResearcherProposal().setSubSector(
                rmsConfigurationClientService.getBySubSectorId(researcherProposal.get().getStSubSectorsId()).getObj());
        response.getResearcherProposal().setResearchCategoryType(rmsConfigurationClientService
                .getByResearchCategoryTypeId(researcherProposal.get().getStResearchCatTypeId()).getObj());

        response.setResearcherProposalInfo(
                researcherProposalInfoService.getByResearcherProposalId(researcherProposal.get().getId()).getObj());
        response.setResearcherProposalInstituteInfo(researcherProposalInstituteInfoService
                .findByResearcherProposalId(researcherProposal.get().getId()).getObj());
        response.setResearcherProposalRscWorkingInOrg(researcherProposalRscWorkingInOrgService
                .getListFindByResearcherProposalId(researcherProposal.get().getId()).getItems());
        response.setResearcherProposalUploadDoc(researcherProposalUploadDocService
                .getByResearcherProposalId(researcherProposal.get().getId()).getItems());
        response.setResearcherSupervisorInfo(
                researcherSupervisorInfoService.getByResearcherProposalId(researcherProposal.get().getId()).getObj());
        response.setResearcherProposalActionPlan(researcherProposalActionPlanService
                .getByResearcherProposalId(researcherProposal.get().getId()).getItems());
        response.setResearcherProposalBudgetDetails(researcherProposalBudgetDetailsService
                .getByResearcherProposalId(researcherProposal.get().getId()).getItems());

        response.setResearcherProposalUploadDoc(researcherProposalUploadDocService
                .getByResearcherProposalId(researcherProposal.get().getId()).getItems());

        if (response.getResearcherProposalBudgetDetails() != null
                && !response.getResearcherProposalBudgetDetails().isEmpty()) {
            Map<Long, ExpenditureItemResponseDto> itemResponseDtoMap = rmsConfigurationClientService
                    .getByExpenditureItemIdSet(new IdSetRequestBodyDTO() {
                        {
                            setIds(response.getResearcherProposalBudgetDetails().stream()
                                    .map(ResearcherProposalBudgetDetailsResponseDto::getStExpenditureItemId)
                                    .collect(Collectors.toSet()));
                        }
                    }).getItems().stream().collect(Collectors.toMap(UuidIdHolderRequestBodyDTO::getId, dto -> dto));
            response.getResearcherProposalBudgetDetails().forEach(e -> {
                e.setExpenditureItem(itemResponseDtoMap.get(e.getStExpenditureItemId()));
            });
        }

        return new Response<>() {
            {
                setSuccess(true);
                setMessage("Data Found");
                setObj(response);
            }
        };
    }

    @Override
    public Response<ResearcherProposalDetailsResponseDto> getListFindByResProfilePersonalInfoId(
            PageableRequestBodyDTO requestBodyDTO, Long resProfilePersonalInfoId) {

        Response<ResearcherProposalResponseDto> response = new Response();
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<ResearcherProposal> ePage = null;

        try {
            ePage = repository.findAllByResearcherProfilePersonalInfoMasterIdAndIsDeleted(pageable,
                    resProfilePersonalInfoId, false);

            if (!CollectionUtils.isEmpty(ePage.getContent())) {
                response.setPage(
                        new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements()));

                return getSuccessResponse("Data found ", response);
            }
            return getSuccessResponse("Data Empty ");

        } catch (Exception e) {
            logger.error(e.getMessage());
            return getErrorResponse("Data not found !!");
        }
    }

    @Override
    public Response<ResearcherProposalResponseDto> getResearcherProfileByFiscalYear(Long fiscalYearId) {
        List<ResearcherProposal> researcherProposalList = repository.findByStFiscalYearIdAndIsDeleted(fiscalYearId,
                false);

        if (researcherProposalList.isEmpty()) {
            return getSuccessResponse("Data Empty");
        }

        return new Response<ResearcherProposalResponseDto>() {
            {
                setSuccess(true);
                setMessage("Data Found");
                setItems(convertForRead(researcherProposalList));
            }
        };
    }

    @Override
    public Response<ResearcherProposalResponseDto> getAllResearcherProposal() {
        List<ResearcherProposal> researcherProposalList = repository.findAllByIsDeleted(false);
        if (researcherProposalList.isEmpty()) {
            return getSuccessResponse("Data Empty");
        }
        return new Response<ResearcherProposalResponseDto>() {
            {
                setSuccess(true);
                setMessage("Data Found");
                setItems(convertForRead(researcherProposalList));
            }
        };
    }

    @Override
    public Response<ResearcherProposalResponseDto> findAllByStFiscalYearId(
            ResearcherProposalRequestDto requestDto) {

        List<ResearcherProposal> list = new ArrayList<ResearcherProposal>();
        Response<ResearcherProposalResponseDto> response = new Response<ResearcherProposalResponseDto>();

        if (requestDto.getStFiscalYearId() != null
                && requestDto.getStResearchCatTypeId() == null && requestDto.getStSectorTypeId() == null) {
            list = repository.findAllByStFiscalYearIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStFiscalYearId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() == null
                && requestDto.getStResearchCatTypeId() != null && requestDto.getStSectorTypeId() == null) {
            list = repository.findAllByStResearchCatTypeIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStResearchCatTypeId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() == null
                && requestDto.getStResearchCatTypeId() == null && requestDto.getStSectorTypeId() != null) {
            list = repository.findAllByStSectorTypeIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStSectorTypeId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() != null
                && requestDto.getStResearchCatTypeId() != null && requestDto.getStSectorTypeId() == null) {
            list = repository.findAllByStFiscalYearIdAndStResearchCatTypeIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStFiscalYearId(),
                    requestDto.getStResearchCatTypeId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() == null
                && requestDto.getStResearchCatTypeId() != null && requestDto.getStSectorTypeId() != null) {
            list = repository.findAllByStResearchCatTypeIdAndStSectorTypeIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStResearchCatTypeId(), requestDto.getStSectorTypeId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() != null
                && requestDto.getStResearchCatTypeId() == null && requestDto.getStSectorTypeId() != null) {
            list = repository.findAllByStFiscalYearIdAndStSectorTypeIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStFiscalYearId(), requestDto.getStSectorTypeId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() != null
                && requestDto.getStResearchCatTypeId() != null && requestDto.getStSectorTypeId() != null) {
            list = repository.findAllByStFiscalYearIdAndStResearchCatTypeIdAndStSectorTypeIdAndIsDeletedAndIsFinalSubmit(
                    requestDto.getStFiscalYearId(), requestDto.getStResearchCatTypeId(),
                    requestDto.getStSectorTypeId(), false, true);
        }

        else if (requestDto.getStFiscalYearId() == null
                && requestDto.getStResearchCatTypeId() == null && requestDto.getStSectorTypeId() == null) {
            list = repository.findAllByIsDeletedAndIsFinalSubmit(false, true);
        }

        if (list != null && !CollectionUtils.isEmpty(list)) {

            for (ResearcherProposal l : list) {
                if (l.getResearcherProfilePersonalInfoMaster().getUserId() != null) {
                    l.setUserDto(uaaClientService.getUser(l.getResearcherProfilePersonalInfoMaster().getUserId()).getBody());
                }

                Optional<ViewResearcherList> researcherLists =
                        viewResearcherRepository.findByStFiscalYearIdAndStResearchCatTypeIdAndStSectorTypeIdAndResearchTitleAndUserIdAndIsFinalSubmitAndIsDeleted(
                        l.getStFiscalYearId(), l.getStResearchCatTypeId(), l.getStSectorTypeId(), l.getResearchTitle(),
                                l.getResearcherProfilePersonalInfoMaster().getUserId(), l.getIsFinalSubmit(), false);
                ViewResearcherList researcher = researcherLists.get();
                l.setProposalUuid(researcher.getProposalUuid());

//                String sql = "FROM ViewResearcherList WHERE stFiscalYearId = :fiscalYearId "
//                        + "AND stResearchCatTypeId = :researchCatTypeId "
//                        + "AND stSectorTypeId = :sectorTypeId "
//                        + "AND researchTitle LIKE CONCAT('%', :researchTitle, '%')";
//                Configuration configuration = new Configuration().configure();
//                SessionFactory sessionFactory = configuration.buildSessionFactory();
//                Session session = sessionFactory.openSession();
//                Query<ViewResearcherList> query = session.createQuery(sql, ViewResearcherList.class)
//                        .setParameter("fiscalYearId", l.getStFiscalYearId())
//                        .setParameter("researchCatTypeId", l.getStResearchCatTypeId())
//                        .setParameter("sectorTypeId", l.getStSectorTypeId())
//                        .setParameter("researchTitle", l.getResearchTitle());
//
//                List<ViewResearcherList> results = query.getResultList();
            }

            response.setItems(convertForRead(list));
            return getSuccessResponse("Data Found", response);
        }
        return getErrorResponse("Data Not Found !.");
    }

    @Override
    public Response<ResearcherProposalResponseDto> updateApprovalStatus(
            ResearcherProposalRequestDto researcherProposalRequestDto) {

        ResearcherProposal response = new ResearcherProposal();
        Response<ResearcherProposalResponseDto> res = new Response();

        Optional<ResearcherProposal> option = repository.findById(researcherProposalRequestDto.getId());
        if (option.isPresent()) {
            ResearcherProposal exestingData = option.get();

            if (exestingData.getApprovalStatus() != null && exestingData.getApprovalStatus() == 1) {
                getErrorResponse("Allready Approved!.");
            }

            if (exestingData.getApprovalStatus() != null && exestingData.getApprovalStatus() == 4) {
                getErrorResponse("Allready Cancaled!.");
            }

            exestingData.setApprovalStatus(researcherProposalRequestDto.getApprovalStatus());
            response = repository.save(exestingData);
            res.setObj(convertForRead(response));
            return getSuccessResponse("Update Successfull!.", res);
        }
        return getErrorResponse("Update Failed!.");
    }

    @Override
    public Response<ResearcherProposalResponseDto> getListFindByResProfilePersonalInfoId(
            Long resProfilePersonalInfoId) {

        List<ResearcherProposal> researcherProposalList = repository
                .findAllByResearcherProfilePersonalInfoMasterIdAndIsDeleted(resProfilePersonalInfoId, false);

        if (researcherProposalList.size() > 0 && !CollectionUtils.isEmpty(researcherProposalList)) {

            return new Response<ResearcherProposalResponseDto>() {
                {
                    setMessage("Data Found");
                    setSuccess(true);
                    setItems(convertForRead(researcherProposalList));
                }
            };

        }

        return new Response<ResearcherProposalResponseDto>() {
            {
                setMessage("Data Not Found!");
                setSuccess(false);
            }
        };
    }

    @Override
    public Response<List<ResearcherProposalResponseDto>> getResearcherProposalsByUserid(Long id) {
        Response<List<ResearcherProposalResponseDto>> response = new Response<>();
        List<ResearcherProposalResponseDto> list = new ArrayList<>();
        // User type check first
        ResponseEntity<UserResponse> usresult = uaaClientService.getUser(id);
        if (usresult == null) {
            response.setSuccess(false);
            response.setObj(null);
            response.setMessage("User not found in this system");
            return response;
        }

        UserResponse user = usresult.getBody();
        if (!"Rms_Researcher".equalsIgnoreCase(user.getUserType())) {

            List<ResearcherProposal> datas = repository.findAllByIsDeletedAndApprovalStatus(false, 1);
            if (datas != null && !datas.isEmpty()) {

                for (ResearcherProposal r : datas) {
                    ResearcherProposalResponseDto dto = new ResearcherProposalResponseDto();
                    BeanUtils.copyProperties(r, dto);
                    list.add(dto);
                }

                response.setSuccess(true);
                response.setObj(list);
                response.setMessage("Data found");
                return response;
            }

            response.setSuccess(false);
            response.setObj(null);
            response.setMessage("Data not found");
            return response;
        }

        // if researcher
        List<ResearcherProfilePersonalInfoMaster> rppimList = researcherProfilePersonalInfoMasterService
                .findResearcherProfilePersonalInfoByUserId(id);
        if (rppimList == null || rppimList.isEmpty())
            return null;

        for (ResearcherProfilePersonalInfoMaster rppim : rppimList) {

            List<ResearcherProposal> rList = repository
                    .findAllByResearcherProfilePersonalInfoMasterAndIsDeletedAndApprovalStatus(rppim, false, 1);
            if (rList != null && !rList.isEmpty()) {
                for (ResearcherProposal rl : rList) {
                    ResearcherProposalResponseDto dto = new ResearcherProposalResponseDto();
                    BeanUtils.copyProperties(rl, dto);
                    list.add(dto);
                }
            }

        }

        if (list.isEmpty()) {
            response.setSuccess(false);
            response.setObj(null);
            response.setMessage("Data not found");
            return response;
        }

        response.setSuccess(true);
        response.setObj(list);
        response.setMessage("Data found");
        return response;
    }

    @Override
    public ResearcherProposal findById(Long id) {
        Optional<ResearcherProposal> result = repository.findByIdAndIsDeleted(id, false);
        return result.isPresent() ? result.get() : null;
    }

    @Override
    public Response<ResearcherProposalResponseDto> getResearchInformation(String uuid) {

        Response<ResearcherProposalResponseDto> response = getByUuid(uuid);
        ResearcherProposalResponseDto responseDto = null;

        if (response.isSuccess() && response.getObj() != null) {
            responseDto = response.getObj();
        }

        if (responseDto != null && responseDto.getId() != null) {
            Response<AgreementWithResearcherResponseDto> agreemenResponse = agreementWithResearcherService
                    .findByResearcherProposalIdAndIsDeleted(responseDto.getId());
            responseDto.setAgreementWithResearcherResponseDto(agreemenResponse.getObj());
        }

        if (responseDto != null && responseDto.getAgreementWithResearcherResponseDto() != null
                && responseDto.getAgreementWithResearcherResponseDto().getId() != null) {
            Response<AgreementInstallmentResponseDto> agreementInstallmentResponse = agreementInstallmentService
                    .findAllByAgreementWithResearcherId(responseDto.getAgreementWithResearcherResponseDto().getId());
            responseDto.setAgreementInstallmentResponseDtoList(agreementInstallmentResponse.getItems());
        }

        if (responseDto != null && responseDto.getId() != null) {
            Response<ResearcherPresentationResponseDto> presentationResponse = researcherPresentationService
                    .findAllByResearcherProposalId(responseDto.getId());
            responseDto.setResearcherPresentationResponseDtoList(presentationResponse.getItems());
        }

        if (responseDto != null) {
            Response<ResearcherProposalResponseDto> finalresponse = new Response<>();
            finalresponse.setSuccess(true);
            finalresponse.setMessage("Data Found!.");
            finalresponse.setObj(responseDto);
            return finalresponse;
        }

        return getErrorResponse("Data not found !.");
    }

    @Override
    public Response<ResearcherProposalResponseDto> updateFinalSubmitStatus(
            ResearcherProposalRequestDto researcherProposalRequestDto) {

        ResearcherProposal response = new ResearcherProposal();
        Response<ResearcherProposalResponseDto> res = new Response();

        Optional<ResearcherProposal> option = repository.findById(researcherProposalRequestDto.getId());

        if (!option.isPresent()) {
            return getErrorResponse("Researcher proposal not found !.");
        }

        if (option.isPresent()) {
            ResearcherProposal exestingData = option.get();
            exestingData.setIsFinalSubmit(researcherProposalRequestDto.getIsFinalSubmit());
            response = repository.save(exestingData);
            res.setObj(convertForRead(response));
            return getSuccessResponse("Update Successfull!.", res);
        }
        return getErrorResponse("Update Failed!.");
    }

    @Override
    public Response<ResearcherProposalResponseDto> getProposalByProfileUuid(String uuid) {

        Response<ResearcherProposalResponseDto> response = new Response<>();
        ResearcherProposalResponseDto researcherProposalResponseDto = null;
        ResearcherProposal data = repository.getProposalByProfileId(uuid);

        if (data != null) {
            researcherProposalResponseDto = super.convertForRead(data);
        }

        if (researcherProposalResponseDto == null) {
            response.setSuccess(false);
            response.setMessage("Data Not Found");
            return response;
        }

        response.setSuccess(true);
        response.setMessage("Data Found");
        response.setObj(researcherProposalResponseDto);
        return response;
    }

    @Override
    public Response<ResearcherProposalResponseDto> getProposalListByFinalSubmit(Boolean byFinalSubmit) {
        List<ResearcherProposal> allByIsFinalSubmitAndIsDeleted = repository.findAllByIsFinalSubmitAndIsDeleted(byFinalSubmit, false);


        if (!allByIsFinalSubmitAndIsDeleted.isEmpty() && allByIsFinalSubmitAndIsDeleted.size() > 0) {
            return new Response<ResearcherProposalResponseDto>() {{
                setSuccess(true);
                setMessage("Data Found");
                setItems(convertForRead(allByIsFinalSubmitAndIsDeleted));
            }};
        }
        return getErrorResponse("Data Not found!.");
    }

    @Override
    public Response<ResearcherProposalResponseDto> getProposalResponse(String uuid) {
        Response<ResearcherProposalResponseDto> res = super.getByUuid(uuid);
        if (res.isSuccess()) {
            res.getObj().setFiscalYear(
                    rmsConfigurationClientService.getByFiscalYearId(res.getObj().getStFiscalYearId()).getObj());
            res.getObj().setResearchCategoryType(rmsConfigurationClientService
                    .getByResearchCategoryTypeId(res.getObj().getStResearchCatTypeId()).getObj());
            res.getObj().getResearcherProfilePersonalInfoDto().setUserDto(
                    uaaClientService.getUser(res.getObj().getResearcherProfilePersonalInfoDto().getUserId()).getBody());

        }
        return res;
    }

    public Response<ResearcherProposalResponseDto> getListByFiscalYearIdResearchCatId(Long stFiscalYearId, Long stResearchCatId){
        List<ResearcherProposal> researcherProposalList = repository.findAllByStFiscalYearIdAndStResearchCatTypeIdAndIsDeletedAndIsFinalSubmit(stFiscalYearId, stResearchCatId, false, true);
        if(!researcherProposalList.isEmpty()){
            return new Response<ResearcherProposalResponseDto>(){{
                setSuccess(true);
                setMessage("Data found");
                setItems(convertForRead(researcherProposalList));
            }};
        }
        return getErrorResponse("Data not found!");
    }

}
