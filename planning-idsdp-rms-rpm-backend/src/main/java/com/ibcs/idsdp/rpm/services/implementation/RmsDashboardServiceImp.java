package com.ibcs.idsdp.rpm.services.implementation;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.TranningInstitudeClientService;
import com.ibcs.idsdp.rpm.client.dto.response.ProposalModel;
import com.ibcs.idsdp.rpm.client.dto.response.ProposalStatus;
import com.ibcs.idsdp.rpm.client.dto.response.ResearchCategoryTypeResponseDto;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProposal;
import com.ibcs.idsdp.rpm.model.repositories.AgreementWithResearcherRepository;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProposalRepository;
import com.ibcs.idsdp.rpm.services.RmsDashboardService;
import com.ibcs.idsdp.rpm.web.dto.response.CategoriesWiseProposalResponse;
import com.ibcs.idsdp.rpm.web.dto.response.RmsDashboardResponse;
import com.ibcs.idsdp.rpm.web.dto.response.SDGsWiseResearchResponse;
import com.ibcs.idsdp.rpm.web.dto.response.TrainingInstituteResponse;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

/**
 * @author moniruzzaman.rony
 * @create 1/6/22
 * @github `https://github.com/moniruzzamanrony`
 */

@Slf4j
@Service
@AllArgsConstructor
public class RmsDashboardServiceImp implements RmsDashboardService {

    private ResearcherProposalRepository researcherProposalRepository;
    private RmsConfigurationClientService rmsConfigurationClientService;
    private final AgreementWithResearcherRepository agreementWithResearcherRepository;
    private final TranningInstitudeClientService tranningInstitudeClientService;

    @Override
    public Response getRmsDashboardData(Optional<Long> fiscalYearIdOptional) {
    	
        RmsDashboardResponse rmsDashboardResponse = new RmsDashboardResponse();
        
        if (!fiscalYearIdOptional.isPresent()) {        	
        	
//        	{ id: 1, value: 'Approved' },
//            { id: 2, value: 'Not Approved' },
//            { id: 3, value: 'Panding' },
//            { id: 4, value: 'Cancaled' }, t
//            { id: 5, value: 'Completed' }, t
//            { id: 6, value: 'Defaulter' }, t
//            { id: 7, value: 'Final Report Submit' },
        	
            List<ResearcherProposal> allResearcherProposalList = researcherProposalRepository.findAllByIsFinalSubmitAndIsDeleted(true,false);
            
            rmsDashboardResponse.setCompletedResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndIsDeleted(5, false)); //t
            
            rmsDashboardResponse.setOngoingResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndIsDeleted(1, false));
            
            rmsDashboardResponse.setCancelledResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndIsDeleted(7, false));
            
            rmsDashboardResponse.setDefaulterResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndIsDeleted(6, false)); //t
            
            rmsDashboardResponse.setResearchProposalCount(researcherProposalRepository.getProposalCountByApproveStatusAndIsDeleted(3, false));
            
            rmsDashboardResponse.setCancelledProposalCount(researcherProposalRepository.getProposalCountByApproveStatusAndIsDeleted(4, false)); //t

            List<CategoriesWiseProposalResponse> rmsDashboardResponseResponseList = new ArrayList<>();
            Response<ResearchCategoryTypeResponseDto> researchCategoryResponse = rmsConfigurationClientService.getAllResearchCategory();
            List<ResearchCategoryTypeResponseDto> researchCategoryResponseList = researchCategoryResponse.getItems();

            researchCategoryResponseList.forEach(res -> {
                List<ResearcherProposal> researcherProposalList = researcherProposalRepository.getAllByStResearchCatTypeIdAndIsFinalSubmitAndIsDeleted(res.getId(),true, false);
                CategoriesWiseProposalResponse categoriesWiseProposalResponse = new CategoriesWiseProposalResponse();
                categoriesWiseProposalResponse.setCategoryName(res.getCategoryName());
                categoriesWiseProposalResponse.setCountProposal(researcherProposalList.size());
                categoriesWiseProposalResponse.setPercentageProposal((100 * researcherProposalList.size()) / allResearcherProposalList.size());
                rmsDashboardResponseResponseList.add(categoriesWiseProposalResponse);
            });

            rmsDashboardResponse.setCategoriesWiseProposalResponsesList(rmsDashboardResponseResponseList);

            //Tranning  Institute
            ResponseEntity<List<ProposalModel>> proposalModelListResponse = tranningInstitudeClientService.getAllProposalList();
            List<ProposalModel> proposalModelList = proposalModelListResponse.getBody();
            rmsDashboardResponse.setTotalInstituteCount(proposalModelList.size());
            rmsDashboardResponse.setApproveInstituteCount(proposalModelList.stream().filter(proposalModel -> proposalModel.getProposalStatus().equals(ProposalStatus.APPROVED)).collect(Collectors.toList()).size());
            rmsDashboardResponse.setUnapprovedInstituteCount(proposalModelList.stream().filter(proposalModel -> proposalModel.getProposalStatus().equals(ProposalStatus.REJECTED)).collect(Collectors.toList()).size());

            //Grant Status
            rmsDashboardResponse.setGrantAcceptedCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(1, false).size());
            rmsDashboardResponse.setGrantPendingCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(0, false).size());
            rmsDashboardResponse.setGrantQueryCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(3, false).size());
            rmsDashboardResponse.setGrantRejectedCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(2, false).size());


            //SDGsWiseResearch
            List<SDGsWiseResearchResponse> sDGsWiseResearchResponseList = new ArrayList<>();
            addSDGsResearchInList(sDGsWiseResearchResponseList, 1, "No Poverty");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 2, "Zero Hunger");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 3, "Good Health and Well-being");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 4, "Quality Education");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 5, "Gender Equality");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 6, "Clean Water and Sanitation");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 7, "Affordable and Clean Energy");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 8, "Decent Work and Economic Growth");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 9, "Industry, Innovation and Infrastructure");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 10, "Reduced Inequality");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 11, "Sustainable Cities and Communities");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 12, "Responsible Consumption and Production");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 13, "Climate Action");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 14, "Life Below Water");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 15, "Life on Land");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 16, "Peace and Justice Strong Institutions");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 17, "Partnerships to achieve the Goal");

            //TI List for table
            ResponseEntity<List<TrainingInstituteResponse>> trainingInstituteResponse = tranningInstitudeClientService.getTrainingInstituteDataForDashboard();
            rmsDashboardResponse.setTrainingInstituteResponseList(trainingInstituteResponse.getBody());

            //SDgs Goal
            ObjectMapper mapper = new ObjectMapper();
            allResearcherProposalList.forEach(allResearcherProposal -> {
                try {
                    Arrays.stream(mapper.readValue(allResearcherProposal.getStSdgsGoalsId(), int[].class)).forEach(sdgsGoalsId -> {
                        sDGsWiseResearchResponseList.forEach(sDGsWiseResearchResponse -> {
                            if (sDGsWiseResearchResponse.getSDGsId() == sdgsGoalsId) {
                                sDGsWiseResearchResponse.setTotalResearchCount(sDGsWiseResearchResponse.getTotalResearchCount() + 1);
                            }
                        });

                    });

                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            });

            rmsDashboardResponse.setSDGsWiseResearchResponseList(sDGsWiseResearchResponseList);

        }
        else {
            Long fiscalYearId = fiscalYearIdOptional.get();
            List<ResearcherProposal> allResearcherProposalList = researcherProposalRepository.findAllByIsFinalSubmitAndIsDeleted(true, false);
            rmsDashboardResponse.setCompletedResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(5, fiscalYearId, false));
            rmsDashboardResponse.setOngoingResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(1, fiscalYearId, false));
            rmsDashboardResponse.setCancelledResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(7, fiscalYearId, false));
            rmsDashboardResponse.setDefaulterResearchCount(researcherProposalRepository.getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(6, fiscalYearId, false));
            rmsDashboardResponse.setResearchProposalCount(researcherProposalRepository.getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(3, fiscalYearId, false));
            rmsDashboardResponse.setCancelledProposalCount(researcherProposalRepository.getProposalCountByApproveStatusAndFiscalYearIdAndIsDeleted(4, fiscalYearId, false));

            List<CategoriesWiseProposalResponse> rmsDashboardResponseResponseList = new ArrayList<>();
            Response<ResearchCategoryTypeResponseDto> researchCategoryResponse = rmsConfigurationClientService.getAllResearchCategory();
            List<ResearchCategoryTypeResponseDto> researchCategoryResponseList = researchCategoryResponse.getItems();

            researchCategoryResponseList.forEach(res -> {
                List<ResearcherProposal> researcherProposalList = researcherProposalRepository.getAllByStResearchCatTypeIdAndIsFinalSubmitAndIsDeletedAndStFiscalYearId(res.getId(),true, false, fiscalYearId);
                CategoriesWiseProposalResponse categoriesWiseProposalResponse = new CategoriesWiseProposalResponse();
                categoriesWiseProposalResponse.setCategoryName(res.getCategoryName());
                categoriesWiseProposalResponse.setCountProposal(researcherProposalList.size());
                categoriesWiseProposalResponse.setPercentageProposal((100 * researcherProposalList.size()) / allResearcherProposalList.size());
                rmsDashboardResponseResponseList.add(categoriesWiseProposalResponse);
            });

            rmsDashboardResponse.setCategoriesWiseProposalResponsesList(rmsDashboardResponseResponseList);

//            //Tranning  Institute
            ResponseEntity<List<ProposalModel>> proposalModelListResponse = tranningInstitudeClientService.getAllProposalList();
            List<ProposalModel> proposalModelList = proposalModelListResponse.getBody();
            List<ProposalModel> proposalModelListByFiscalYear = proposalModelList.stream().filter(pm -> pm.getFiscalYearId() == fiscalYearId).collect(Collectors.toList());
            rmsDashboardResponse.setTotalInstituteCount(proposalModelListByFiscalYear.size());
            rmsDashboardResponse.setApproveInstituteCount(proposalModelListByFiscalYear.stream().filter(proposalModel -> proposalModel.getProposalStatus().equals(ProposalStatus.APPROVED)).collect(Collectors.toList()).size());
            rmsDashboardResponse.setUnapprovedInstituteCount(proposalModelListByFiscalYear.stream().filter(proposalModel -> proposalModel.getProposalStatus().equals(ProposalStatus.REJECTED)).collect(Collectors.toList()).size());

            //Grant Status
            rmsDashboardResponse.setGrantAcceptedCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(1, false).size());
            rmsDashboardResponse.setGrantPendingCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(0, false).size());
            rmsDashboardResponse.setGrantQueryCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(3, false).size());
            rmsDashboardResponse.setGrantRejectedCount(agreementWithResearcherRepository.findAllByApprovalStatusAndIsDeleted(2, false).size());


            //TI List for table
            ResponseEntity<List<TrainingInstituteResponse>> trainingInstituteResponse = tranningInstitudeClientService.getTrainingInstituteDataForDashboard();
            rmsDashboardResponse.setTrainingInstituteResponseList(trainingInstituteResponse.getBody());

            //SDGsWiseResearch
            List<SDGsWiseResearchResponse> sDGsWiseResearchResponseList = new ArrayList<>();
            addSDGsResearchInList(sDGsWiseResearchResponseList, 1, "No Poverty");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 2, "Zero Hunger");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 3, "Good Health and Well-being");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 4, "Quality Education");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 5, "Gender Equality");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 6, "Clean Water and Sanitation");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 7, "Affordable and Clean Energy");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 8, "Decent Work and Economic Growth");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 9, "Industry, Innovation and Infrastructure");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 10, "Reduced Inequality");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 11, "Sustainable Cities and Communities");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 12, "Responsible Consumption and Production");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 13, "Climate Action");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 14, "Life Below Water");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 15, "Life on Land");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 16, "Peace and Justice Strong Institutions");
            addSDGsResearchInList(sDGsWiseResearchResponseList, 17, "Partnerships to achieve the Goal");


            ObjectMapper mapper = new ObjectMapper();

            allResearcherProposalList.forEach(allResearcherProposal -> {
                try {
                    if (allResearcherProposal.getStFiscalYearId() == fiscalYearId) {
                        Arrays.stream(mapper.readValue(allResearcherProposal.getStSdgsGoalsId(), int[].class)).forEach(sdgsGoalsId -> {
                            sDGsWiseResearchResponseList.forEach(sDGsWiseResearchResponse -> {
                                if (sDGsWiseResearchResponse.getSDGsId() == sdgsGoalsId) {
                                    sDGsWiseResearchResponse.setTotalResearchCount(sDGsWiseResearchResponse.getTotalResearchCount() + 1);
                                }
                            });

                        });
                    }
                } catch (JsonProcessingException e) {
                    e.printStackTrace();
                }
            });

            rmsDashboardResponse.setSDGsWiseResearchResponseList(sDGsWiseResearchResponseList);
        }

        Response<RmsDashboardResponse> rmsDashboardResponseResponse = new Response<RmsDashboardResponse>();
        rmsDashboardResponseResponse.setSuccess(true);
        rmsDashboardResponseResponse.setObj(rmsDashboardResponse);
        return rmsDashboardResponseResponse;
    }

    private void addSDGsResearchInList(List<SDGsWiseResearchResponse> sDGsWiseResearchResponseList, int id, String name) {
        SDGsWiseResearchResponse noPoverty = new SDGsWiseResearchResponse();
        noPoverty.setSDGsName(name);
        noPoverty.setSDGsId(id);
        sDGsWiseResearchResponseList.add(noPoverty);
    }
}
