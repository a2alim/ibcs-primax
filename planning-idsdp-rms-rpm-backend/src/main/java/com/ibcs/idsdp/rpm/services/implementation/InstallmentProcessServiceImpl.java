package com.ibcs.idsdp.rpm.services.implementation;

import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ExpenditureItemResponseDto;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.*;
import com.ibcs.idsdp.rpm.model.repositories.*;
import com.ibcs.idsdp.rpm.services.InstallmentProcessService;
import com.ibcs.idsdp.rpm.web.dto.request.FileRequest;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentType;
import com.ibcs.idsdp.rpm.web.dto.response.AgreementWithResearcherResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.GoLetterResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.ResearcherProposalResponseDto;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.FiscalYearResponse;
import com.ibcs.idsdp.rpm.web.dto.response.configurationResponse.InstallmentTypeResponseDto;
import com.ibcs.idsdp.util.Response;

import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.lang.reflect.Type;
import java.util.*;
import java.util.stream.Collectors;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class InstallmentProcessServiceImpl extends BaseService<InstallmentProcess, InstallmentProcessRequestDto, InstallmentProcessResponseDto> implements InstallmentProcessService {


    private final InstallmentProcessRepository installmentProcessRepository;
    private final ResearcherProposalRepository researcherProposalRepository;
    private final InstallmentProcessExpenditureItemsRepository expenditureItemsRepository;
    private final AgreementWithResearcherRepository agreementWithResearcherRepository;
    private final AgreementInstallmentRepository agreementInstallmentRepository;
    private final RmsConfigurationClientService rmsConfigurationClientService;
    private final InstallmentProcessUploadBillVoucherFilesRepository processUploadBillVoucherFilesRepository;
    private final GoLetterRepository goLetterRepository;


    public InstallmentProcessServiceImpl(ServiceRepository<InstallmentProcess> repository, InstallmentProcessRepository installmentProcessRepository, ResearcherProposalRepository researcherProposalRepository, InstallmentProcessExpenditureItemsRepository expenditureItemsRepository, AgreementWithResearcherRepository agreementWithResearcherRepository, AgreementInstallmentRepository agreementInstallmentRepository, RmsConfigurationClientService rmsConfigurationClientService, InstallmentProcessUploadBillVoucherFilesRepository processUploadBillVoucherFilesRepository, GoLetterRepository goLetterRepository) {
        super(repository);
        this.installmentProcessRepository = installmentProcessRepository;
        this.researcherProposalRepository = researcherProposalRepository;
        this.expenditureItemsRepository = expenditureItemsRepository;
        this.agreementWithResearcherRepository = agreementWithResearcherRepository;
        this.agreementInstallmentRepository = agreementInstallmentRepository;
        this.rmsConfigurationClientService = rmsConfigurationClientService;
        this.processUploadBillVoucherFilesRepository = processUploadBillVoucherFilesRepository;
        this.goLetterRepository = goLetterRepository;
    }

    @Override
    public Response<InstallmentProcessResponseDto> createAgreementInstallment(InstallmentProcessRequestDto requestDto) {

        Optional<ResearcherProposal> proposal = researcherProposalRepository.findById(requestDto.getProposalId());
        proposal.ifPresent(requestDto::setM1ResearcherProposalId);

        if (requestDto.getId() == null) {
            return super.create(requestDto);
        } else {
            return super.update(requestDto);
        }
    }

    @Override
    public BooleanValueHolderDTO updateAgreementInstallment(InstallmentProcessRequestDto requestDto) {

        return null;
    }

    @Override
    public Response<Map<String, Object>> getProposal(String uuid) {
        Optional<ResearcherProposal> byUuidAndIsDeleted = researcherProposalRepository.findByUuidAndIsDeleted(uuid, false);
        Response<Map<String, Object>> response = new Response<>();
        Map<String, Object> map = new HashMap<>();
        if (byUuidAndIsDeleted.isPresent()) {
            ResearcherProposalResponseDto dto = new ResearcherProposalResponseDto();
            ResearcherProposal researcherProposal = byUuidAndIsDeleted.get();
            BeanUtils.copyProperties(researcherProposal, dto);

            // adding proposal
            map.put("proposal", dto);

            //adding agreement
            AgreementWithResearcher agreement = this.getAgreement(researcherProposal);
            map.put("agreement", agreement);

            //adding installment
            List<AgreementInstallment> installments = this.getInstallment(agreement);
            map.put("installments", installments);

            //get installment Type

            Response<InstallmentTypeResponseDto> installmentType = this.getInstallmentType(installments);

            List<InstallmentTypeResponseDto> installmentTypeList = installmentType.getItems();


            List<InstallmentTypeResponseDto> installmentTypeResponseDtos = validateInstallmentType(installmentTypeList, researcherProposal);
            map.put("installmentsType", installmentTypeResponseDtos);

            map.put("installmentsTypeAll", this.getInstallmentType(installments).getItems());


            response.setSuccess(true);
            response.setMessage("Data Found");
            response.setObj(map);
        } else {
            response.setSuccess(false);
            response.setMessage("Data Not Found");
        }

        return response;
    }

    @Override
    public Response getInstallments(String uuid) {
        Response<InstallmentProcess> response = new Response<>();
        Optional<ResearcherProposal> byUuidAndIsDeleted = researcherProposalRepository.findByUuidAndIsDeleted(uuid, false);

        if (byUuidAndIsDeleted.isPresent()) {
            ResearcherProposal researcherProposal = byUuidAndIsDeleted.get();

            List<InstallmentProcess> installmentProcesses = installmentProcessRepository.findAllByM1ResearcherProposalIdAndIsDeleted(researcherProposal, false);

            if (installmentProcesses.isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Data Not Found");
            } else {

                response.setSuccess(true);
                response.setMessage("Data Found");
                response.setItems(installmentProcesses);

            }

        }

        return response;
    }

    @Override
    public Response viewInstallments(String uuid) {
        Response<Map<String, Object>> response = new Response<>();
        Map<String, Object> map = new HashMap<>();
        //Optional<ResearcherProposal> byUuidAndIsDeleted = researcherProposalRepository.findByUuidAndIsDeleted(uuid, false);
        Optional<InstallmentProcess> installmentProcesses = installmentProcessRepository.findByUuidAndIsDeleted(uuid, false);

        if (installmentProcesses.isPresent()) {
            InstallmentProcess process = installmentProcesses.get();
            List<InstallmentProcessExpenditureItems> expenditureList = expenditureItemsRepository.findByM2InstallmentProcessId(process);
            List<InstallmentProcessUploadBillVoucherFiles> vouchers = processUploadBillVoucherFilesRepository.findByM2InstallmentProcessId(process);

            ///

            //parse InstallmentTypes
            Type listTypeModify = new TypeToken<ArrayList<InstallmentType>>() {
            }.getType();
            List<InstallmentType> parsedInstallmentTypes = new Gson().fromJson(process.getInstallmentTypes(), listTypeModify);

           // Long stInstallmentTypeId = process.getStInstallmentTypeId();
           // List<Long> tId = Arrays.asList(stInstallmentTypeId);
            List<Long> tId = parsedInstallmentTypes.stream().map(m->m.getId()).collect(Collectors.toList());
            //

            Response<InstallmentTypeResponseDto> installmentType = rmsConfigurationClientService.getInstallmentType(new IdSetRequestBodyDTO() {{
                setIds(tId.stream().collect(Collectors.toSet()));
            }});


            Response<ExpenditureItemResponseDto> expItems = rmsConfigurationClientService.getByExpenditureItemIdSet(new IdSetRequestBodyDTO() {{
                setIds(expenditureList.stream().map(InstallmentProcessExpenditureItems::getStExpenditureItemId).collect(Collectors.toSet()));
            }});

            List<InstallmentProcessExpenditureItems> expenditureListFinal = new ArrayList<>();

            for (InstallmentProcessExpenditureItems item : expenditureList) {

                for (ExpenditureItemResponseDto exp : expItems.getItems()) {

                    if (exp.getId() == item.getStExpenditureItemId()) {
                        item.setExpenditureItemName(exp.getExpItemsName());
                        expenditureListFinal.add(item);
                    }

                }

            }


            map.put("installmentProcesses", process);
            map.put("installmentType", installmentType.getItems().get(0));
            map.put("expenditureList", expenditureListFinal);
            map.put("vouchers", vouchers);
            response.setSuccess(true);
            response.setMessage("Data Found");
            response.setObj(map);
        } else {

            response.setSuccess(false);
            response.setMessage("Data Not Found");

        }
        return response;

    }

    @Override
    public Response setStatus(InstallmentProcess process) {
        Response<InstallmentProcess> response = new Response<>();
        try {
            Optional<InstallmentProcess> processOptional = installmentProcessRepository.findById(process.getId());
            if (processOptional.isPresent()) {

                InstallmentProcess process2 = processOptional.get();
                if (!process2.getInstallmentStatus().equalsIgnoreCase("Rejected") && !process2.getInstallmentStatus().equalsIgnoreCase("Completed")) {
                    process2.setInstallmentStatus(process.getInstallmentStatus());
                    InstallmentProcess process3 = installmentProcessRepository.save(process2);
                    response.setSuccess(true);
                    response.setMessage("saving Success");
                    response.setObj(process3);
                } else {
                    response.setSuccess(false);
                    response.setMessage("Rejected or Completed are Not Changeable");

                }


            }
        } catch (Exception e) {
            response.setSuccess(false);
            response.setMessage("saving Failed");
        }


        return response;
    }


    private List<InstallmentTypeResponseDto> validateInstallmentType(List<InstallmentTypeResponseDto> installmentTypeList, ResearcherProposal m1ResearcherProposalId) {
        List<InstallmentTypeResponseDto> response = new ArrayList<>();
        List<InstallmentTypeResponseDto> temp = new ArrayList<>();
        List<InstallmentProcess> processAvailable = installmentProcessRepository.findByM1ResearcherProposalIdAndIsDeleted(m1ResearcherProposalId, false);


        if (processAvailable.isEmpty()) {
            return installmentTypeList;
        } else {


            for (InstallmentProcess available : processAvailable) {

               /*
               * */
                String installmentTypes = available.getInstallmentTypes();
                //parse InstallmentTypes
                Type listTypeModify = new TypeToken<ArrayList<InstallmentType>>() {
                }.getType();
                List<InstallmentType> parsedInstallmentTypes = new Gson().fromJson(installmentTypes, listTypeModify);

                for(InstallmentType items: parsedInstallmentTypes){

                    installmentTypeList.removeIf(type -> Objects.equals(type.getId(), items.getId()));
                }




                ////


//                InstallmentTypeResponseDto installmentTypeResponseDto = installmentTypeList.stream().filter(type -> type.getId() == available.getStInstallmentTypeId()).findFirst().get();
//                temp.add(installmentTypeResponseDto);
//            }
//
//            for (InstallmentTypeResponseDto t : temp) {
//                installmentTypeList.removeIf(type -> type.getId() == t.getId());
//
           }
            return installmentTypeList;

        }


    }


    private AgreementWithResearcher getAgreement(ResearcherProposal researcherProposal) {

        List<AgreementWithResearcher> agreementWithResearcher = agreementWithResearcherRepository.findAllByResearcherProposalIdAndIsDeleted(researcherProposal, false);
        return agreementWithResearcher != null ? agreementWithResearcher.get(0) : null;
    }


    private List<AgreementInstallment> getInstallment(AgreementWithResearcher agreementInstallment) {
        List<AgreementInstallment> allByAgreementWithResearcherId = agreementInstallmentRepository.findAllByAgreementWithResearcherId(agreementInstallment);
        AgreementWithResearcherResponseDto agreementWithResearcherResponseDto = new AgreementWithResearcherResponseDto();
        return allByAgreementWithResearcherId;
    }

    //getting installment from settings

    private Response<InstallmentTypeResponseDto> getInstallmentType(List<AgreementInstallment> list) {
        Response<InstallmentTypeResponseDto> response = rmsConfigurationClientService.getInstallmentType(new IdSetRequestBodyDTO() {{
            setIds(list.stream().map(AgreementInstallment::getStInstallmentTypeId).collect(Collectors.toSet()));
        }});
        return response;
    }

    @Override
    public Response<InstallmentProcessResponseDto> getInstallmentProcessById(Long id) {
        Optional<InstallmentProcess> result = installmentProcessRepository.findByIdAndIsDeleted(id, false);
        InstallmentProcess ip = result.isPresent() ? result.get() : null;
        if (ip == null) {
            return new Response<InstallmentProcessResponseDto>() {
                {
                    setMessage("Data Not Found!");
                    setSuccess(false);
                }
            };
        }
        InstallmentProcessResponseDto dto = new InstallmentProcessResponseDto();
        BeanUtils.copyProperties(ip, dto);

        // get stInstallmentTypeId
        if(dto.getStInstallmentTypeId() !=null){
            Response<InstallmentTypeResponseDto> itresponse = rmsConfigurationClientService.getInstallmentTypeById(dto.getStInstallmentTypeId());
            dto.setInstallmentType((InstallmentTypeResponseDto) itresponse.getObj());
        }

        // stFiscalYearId
        Response<FiscalYearResponse> ftresponse = rmsConfigurationClientService.getFiscalYearById(dto.getM1ResearcherProposalId().getStFiscalYearId());
        dto.setFiscalYearResponse((FiscalYearResponse) ftresponse.getObj());

        // researchCategoryType
        Response<ResearchCategoryTypeResponseDto> rctresponse = rmsConfigurationClientService.getByResearchCategoryTypeId(dto.getM1ResearcherProposalId().getStResearchCatTypeId());
        dto.setResearchCategoryType((ResearchCategoryTypeResponseDto) rctresponse.getObj());

        return new Response<InstallmentProcessResponseDto>() {
            {
                setMessage("Data Found");
                setSuccess(true);
                setObj(dto);
            }
        };
    }

    @Override
    public List<InstallmentProcess> findAllByM1ResearcherProposalId(Long id) {
        ResearcherProposal r = new ResearcherProposal();
        r.setId(id);
        return installmentProcessRepository.findAllByM1ResearcherProposalIdAndIsDeleted(r, false);
    }

    @Override
    public BooleanValueHolderDTO doUpdateInstallment(Long id,String uuid) {
        BooleanValueHolderDTO booleanValueHolderDTO = new BooleanValueHolderDTO();
        try {
            Optional<InstallmentProcess> getById = installmentProcessRepository.findById(id);

            if (getById.isPresent()) {
                InstallmentProcess installmentProcess = getById.get();
                installmentProcess.setGoLetterUuid(uuid.equalsIgnoreCase("null")?null:uuid);
                installmentProcessRepository.save(installmentProcess);
                booleanValueHolderDTO.setSuccess(true);
                booleanValueHolderDTO.setMessage("update Success");
            }
        } catch (Exception e) {
            booleanValueHolderDTO.setSuccess(false);
            booleanValueHolderDTO.setMessage(e.getMessage());
        }
        return booleanValueHolderDTO;

    }
    
    
    @Override
    protected InstallmentProcessResponseDto convertForRead(InstallmentProcess e) { 
    	
    	InstallmentProcessResponseDto dto =  super.convertForRead(e);    	
    	Optional<GoLetter> optional = goLetterRepository.findByInstallmentProcessIdAndIsDeleted(new InstallmentProcess() {{
    		setId(dto.getId());
    	}}, false);
    	
    	if(optional.isPresent()) {
    		dto.setGoLetterResponseDto(new ModelMapper().map(optional.get(), GoLetterResponseDto.class));	
    	}
    	
    	return dto;
    }


}
