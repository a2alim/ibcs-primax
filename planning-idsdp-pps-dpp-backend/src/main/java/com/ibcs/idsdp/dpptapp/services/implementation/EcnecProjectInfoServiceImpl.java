package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.client.PpsRdppRtappClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.AgencyDTO;
import com.ibcs.idsdp.dpptapp.client.dto.request.MinistryDivisionDTO;
import com.ibcs.idsdp.dpptapp.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.dpptapp.model.domain.AssignEcnecMeeting;
import com.ibcs.idsdp.dpptapp.model.domain.DppLogFrame;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.model.domain.TappLogFrame;
import com.ibcs.idsdp.dpptapp.model.repositories.LogFrameRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappLogFrameRepository;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.web.dto.*;
import com.ibcs.idsdp.dpptapp.web.dto.ecnecDTO.*;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.jsoup.Jsoup;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.List;
import java.util.Objects;
import java.util.Optional;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Transactional
public class EcnecProjectInfoServiceImpl implements EcnecProjectInfoService {
    private final DppObjectiveCostService dppObjectiveCostService;
    private final TappObjectiveCostService tappObjectiveCostService;
    private final ProjectConceptClientService projectConceptClientService;
    private final ConfigurationClientService configClientService;
    private final DppAnnualPhasingCostService dppAnnualPhasingCostService;
    private final TappAnnualPhasingCostService tappAnnualPhasingCostService;
    private final LogFrameRepository logFrameRepository;
    private final TappLogFrameRepository tappLogFrameRepository;
    private final ProjectMovementService projectMovementService;
    private final ProjectDetailsPartBService projectDetailsPartBService;
    private final DppLocationService dppLocationService;
    private final AssignEcnecMeetingServiceImpl assignEcnecMeetingService;
    private final PpsRdppRtappClientService rdppRtappClientService;

    @Override
    public List<ProjectListResponseDTO> getApprovedDppTapp() {
        List<ProjectListResponseDTO> result = new ArrayList<>();
        List<ProjectConceptResponse> list = projectConceptClientService.getApprovedDppTapp();
        for (ProjectConceptResponse pcInfo : list) {
            ProjectListResponseDTO dto = new ProjectListResponseDTO();
            if (pcInfo.getProjectTypeDTO()!=null && pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
                String projectName = pcInfo.getTitleEn();
                DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getShortInfoByPcUuid(pcInfo.getUuid());
                if (dppInfo != null) {
                    projectName = dppInfo.getProjectTitleEn();
                }
                dto.setPpsCode(pcInfo.getPpsCode());
                dto.setProjectName(projectName);
                dto.setProjectType("DPP");
                result.add(dto);
            } else if (pcInfo.getProjectTypeDTO()!=null && pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
                String projectName = pcInfo.getTitleEn();
                TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getShortInfoByPcUuid(pcInfo.getUuid());
                if (tappInfo != null) {
                    projectName = tappInfo.getProjectTitleEn();
                }
                dto.setPpsCode(pcInfo.getPpsCode());
                dto.setProjectName(projectName);
                dto.setProjectType("TAPP");
                result.add(dto);
            }
        }

        return result;
    }

    @Override
    public EcnecProjectInfoDTO getProjectInfoByProjectCode(String projectCode, String projectType) {
        EcnecProjectInfoDTO result = new EcnecProjectInfoDTO();
        if (projectType.equals("DPP") || projectType.equals("TAPP")) {
            ProjectConceptResponse pcInfo = projectConceptClientService.getProjectConceptByPpsCode(projectCode);
            if (pcInfo != null) {
                MinistryDivisionDTO ministry = configClientService.getMinistryByNameEn(pcInfo.getSponsoringMinistryName());
                AgencyDTO agency = configClientService.getAgencyByNameEn(pcInfo.getImplementingAgencyName());
                ArrayList<String> arrayList = new ArrayList<>();
                arrayList.add(agency == null ? pcInfo.getImplementingAgencyName() : agency.getNameBn());

                result.setCode(pcInfo.getPpsCode());
                result.setApprovalStatus("Approved");
                result.setRevised(false);
                result.setRevisedNumber(0);
                result.setParentProjectCode("");
                result.setRvTotalProjectCost(Double.valueOf(0));
                result.setRvGob(Double.valueOf(0));
                result.setRvProjectAid(Double.valueOf(0));
                result.setRvProjectAidSourceName("");
                result.setRvOwnFund(Double.valueOf(0));
                result.setRvOther(Double.valueOf(0));
                result.setSourceType(pcInfo.getProjectTypeDTO().getNameEn());
                result.setSponsoringMinistry(ministry == null ? pcInfo.getSponsoringMinistryName() : ministry.getNameBn());
                result.setImplementingAgency(arrayList);
                result.setPlanningDivision(configClientService.getBySectorDivisionId(pcInfo.getSectorDivisionId()).getSectorDivisionNameBn()); // sectorDivision
                result.setSector(configClientService.getBySectorId(pcInfo.getSectorId()).getSectorNameBn());
                result.setProjectType(pcInfo.getProjectTypeDTO().getNameEn());
                result.setEcnecProjectId(pcInfo.getEcnecId());
                AssignEcnecMeeting meeting = assignEcnecMeetingService.findByPcUuidAndIsDeleted(pcInfo.getUuid());
                result.setMeetingDate(meeting==null ? null : meeting.getEcnecMeeting().getMeetingDate());
                result.setEcnecMeetingNumber(meeting==null ? 0 : 1);
                result.setSummary("");
                result.setBenefits("");

                if (pcInfo.getProjectTypeDTO().getNameEn().equals("DPP")) {
                    setDppInfo(pcInfo, result);
                } else if (pcInfo.getProjectTypeDTO().getNameEn().equals("TAPP")) {
                    setTappInfo(pcInfo, result);
                }
            }
        } else if (projectType.equals("RDPP") || projectType.equals("RTAPP")) {
            final DecimalFormat decimalFormat = new DecimalFormat("0.00");
            result = rdppRtappClientService.getProjectInfoByProjectCode(projectCode, projectType);
            if (result.getRevisedNumber() == 1) {
                if (projectType.equals("RDPP")) {
                    ResponseEntity<List<GrandTotalResponse>> previousGrandTotalList = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(Long.valueOf(result.getParentProjectCode()));
                    result.setParentProjectCode("");
                    for (GrandTotalResponse grandTotalResponse : Objects.requireNonNull(previousGrandTotalList.getBody())) {
                        if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                            DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                            Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                            result.setTotalProjectCost(Double.valueOf(decimalFormat.format(annualCost.getTotalAmount())));
                            result.setGob(annualCost.getGobAmount());
                            result.setProjectAid(paAmount);
                            result.setOwnFund(annualCost.getOwnFundAmount());
                            result.setOther(annualCost.getOtherAmount());
                            break;
                        }
                    }
                } else {
                    ResponseEntity<List<GrandTotalResponseTapp>> previousGrandTotalList = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(Long.valueOf(result.getParentProjectCode()));
                    result.setParentProjectCode("");
                    for (GrandTotalResponseTapp grandTotalResponse : Objects.requireNonNull(previousGrandTotalList.getBody())) {
                        if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                            TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                            Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                            result.setTotalProjectCost(Double.valueOf(decimalFormat.format(annualCost.getTotalAmount())));
                            result.setGob(annualCost.getGobAmount());
                            result.setProjectAid(paAmount);
                            result.setOwnFund(annualCost.getOwnFundAmount());
                            result.setOther(annualCost.getOtherAmount());
                            break;
                        }
                    }
                }
            }
        }

        return result;
    }

    private void setDppInfo(ProjectConceptResponse pcInfo, EcnecProjectInfoDTO result) {
        DppObjectiveCostDTO dppInfo = dppObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        result.setProjectName(dppInfo==null?pcInfo.getTitleEn():dppInfo.getProjectTitleEn());
        result.setProjectNameBn(dppInfo==null?pcInfo.getTitleBn():dppInfo.getProjectTitleBn());
        result.setStartDate(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCommencement());
        result.setEndDate(dppInfo==null?pcInfo.getExpCommencementDate():dppInfo.getDateCompletion());

        if (dppInfo!=null) {
            ProjectMovementStage currentStage = projectMovementService.getCurrentStageInDpp(dppInfo.getId());
            result.setApprovalDate(currentStage==null?null:currentStage.getMovementTime());
            ProjectDetailsPartB projectDetails = projectDetailsPartBService.getProjectDetailsByProjectId(pcInfo.getUuid());
            result.setPeojectActivity(projectDetails==null?"": Jsoup.parse(projectDetails.getActivities()).text());

            if (dppInfo.getDevelopmentPartnersList()!=null && dppInfo.getDevelopmentPartnersList().size()>0) {
                Long partnerId = dppInfo.getDevelopmentPartnersList().get(0).getDevPartnerId();
                result.setProjectAidSourceName(configClientService.getDevelopmentPartnerById(partnerId).getDevelopmentPartnerName());
            }
            setDppLocationData(dppInfo, result);
        }

        Optional<DppLogFrame> logFrame = logFrameRepository.findAllByProjectConceptUuid(pcInfo.getUuid());
        if (logFrame.isPresent()) {
            DppLogFrame dppLogFrame = logFrame.get();
            result.setPeojectPurpose(Jsoup.parse(dppLogFrame.getObjectiveNS()).text());
        }

        ResponseEntity<List<GrandTotalResponse>> grandTotalList = dppAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcInfo.getId());
        for (GrandTotalResponse grandTotalResponse : grandTotalList.getBody()) {
            if (grandTotalResponse.getDppAnnualPhasing().toString().equals("Grand_Total")) {
                DppAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getDppAnnualPhasingCostTotal().get(0);
                Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                result.setTotalProjectCost(annualCost.getTotalAmount());
                result.setGob(annualCost.getGobAmount());
                result.setProjectAid(paAmount);
                result.setOwnFund(annualCost.getOwnFundAmount());
                result.setOther(annualCost.getOtherAmount());

                result.setMinistryProject(annualCost.getTotalAmount()<=500);
                result.setFastTrackProject(annualCost.getTotalAmount()>=500);
                setSourceOfFinance(result, annualCost.getGobAmount(), paAmount, annualCost.getOwnFundAmount(), annualCost.getOtherAmount());
                break;
            }
        }
    }

    private void setDppLocationData(DppObjectiveCostDTO dppInfo, EcnecProjectInfoDTO result) {
        DppLocationResponse dppLocation = dppLocationService.getByProjectSummaryId(dppInfo.getProjectConceptMasterId());
        if (dppLocation!=null) {
            List<DivisionGeoDTO> divisionList = dppLocation.getDivisions().stream().map(division -> new DivisionGeoDTO() {{
                setName(division.getNameBn());
                setGeoCode(division.getGeoCode());
                setDistrict(new ArrayList<>());
            }}).collect(Collectors.toList());

            for (ZillaRequest districtDTO: dppLocation.getZillas()) {
                for (DivisionGeoDTO division: divisionList) {
                    if (districtDTO.getDivision().getGeoCode().equals(division.getGeoCode())) {
                        List<UpazilaGeoDTO> upazilaList = new ArrayList<>();
                        for (UpaZillaRequest upazila: dppLocation.getUpazilas()) {
                            if (upazila.getZilla().getGeoCode().equals(districtDTO.getGeoCode())) {
                                UpazilaGeoDTO upa = new UpazilaGeoDTO();
                                upa.setName(upazila.getNameBn());
                                upa.setGeoCode(upazila.getGeoCode());
                                upazilaList.add(upa);
                            }
                        }

                        DistrictGeoDTO district = new DistrictGeoDTO();
                        district.setName(districtDTO.getNameBn());
                        district.setGeoCode(districtDTO.getGeoCode());
                        district.setUpazila(upazilaList);
                        division.getDistrict().add(district);
                    }
                }
            }

            result.setLocation(divisionList);
        }
    }

    private void setTappInfo(ProjectConceptResponse pcInfo, EcnecProjectInfoDTO result) {
        TappObjectiveCostDTO tappInfo = tappObjectiveCostService.getObjectiveCostByPcUuid(pcInfo.getUuid());
        result.setProjectName(tappInfo==null?pcInfo.getTitleEn():tappInfo.getProjectTitleEn());
        result.setProjectNameBn(tappInfo==null?pcInfo.getTitleBn():tappInfo.getProjectTitleBn());
        result.setStartDate(tappInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCommencement());
        result.setEndDate(tappInfo==null?pcInfo.getExpCommencementDate():tappInfo.getDateCompletion());

        if (tappInfo!=null) {
            ProjectMovementStage currentStage = projectMovementService.getCurrentStageInTapp(tappInfo.getId());
            result.setApprovalDate(currentStage==null?null:currentStage.getMovementTime());

            if (tappInfo.getDevPartnerlist()!=null && tappInfo.getDevPartnerlist().size()>0) {
                Long partnerId = tappInfo.getDevPartnerlist().get(0).getDevPartnerId();
                result.setProjectAidSourceName(configClientService.getDevelopmentPartnerById(partnerId).getDevelopmentPartnerName());
            }
        }

        Optional<TappLogFrame> logFrame = tappLogFrameRepository.findByPcUuid(pcInfo.getUuid());
        if (logFrame.isPresent()) {
            TappLogFrame tappLogFrame = logFrame.get();
            result.setPeojectPurpose(Jsoup.parse(tappLogFrame.getObjectiveNS()).text());
        }

        ResponseEntity<List<GrandTotalResponseTapp>> grandTotal = tappAnnualPhasingCostService.getGrandTotalByProjectConceptId(pcInfo.getId());
        for (GrandTotalResponseTapp grandTotalResponse : grandTotal.getBody()) {
            if (grandTotalResponse.getComponentName().toString().equals("Grand_Total")) {
                TappAnnualPhasingCostTotalDTO annualCost = grandTotalResponse.getTappAnnualPhasingCostTotal().get(0);
                Double paAmount = annualCost.getGobThruAmount()+annualCost.getSpAcAmount()+annualCost.getThruPdAmount()+annualCost.getThruDpAmount();
                result.setTotalProjectCost(annualCost.getTotalAmount());
                result.setGob(annualCost.getGobAmount());
                result.setProjectAid(paAmount);
                result.setOwnFund(annualCost.getOwnFundAmount());
                result.setOther(annualCost.getOtherAmount());

                result.setMinistryProject(annualCost.getTotalAmount()<=500);
                result.setFastTrackProject(annualCost.getTotalAmount()>=500);
                setSourceOfFinance(result, annualCost.getGobAmount(), paAmount, annualCost.getOwnFundAmount(), annualCost.getOtherAmount());
                break;
            }
        }
    }

    private void setSourceOfFinance(EcnecProjectInfoDTO result, Double gobAmount, Double paAmount, Double ownAmount, Double otherAmount) {
        Double maxAmount = Math.max(Math.max(gobAmount, paAmount), Math.max(ownAmount, otherAmount));
        if (Double.compare(maxAmount, gobAmount) == 0) {
            result.setSourceOfFinance("GOB");
        } else if (Double.compare(maxAmount, paAmount) == 0) {
            result.setSourceOfFinance("Project Aid");
        } else if (Double.compare(maxAmount, ownAmount) == 0) {
            result.setSourceOfFinance("Own Source");
        } else if (Double.compare(maxAmount, otherAmount) == 0) {
            result.setSourceOfFinance("Other Source");
        }
    }

    @Override
    public ResponseStatusDTO ecnecApprovalProjectAcknowledgement(ProjectListDTO projectDTO) {
        if (projectDTO.getProjectType().equals("DPP") || projectDTO.getProjectType().equals("TAPP")) {
            return projectConceptClientService.ecnecApprovalProjectAcknowledgement(projectDTO);
        } else if (projectDTO.getProjectType().equals("RDPP") || projectDTO.getProjectType().equals("RTAPP")) {
            return rdppRtappClientService.rdppRtappApprovalProjectAcknowledgement(projectDTO);
        }
        return null;
    }

    @Override
    public List<ProjectListResponseDTO> getApprovedRdppRtapp() {
        return rdppRtappClientService.getAllApprovalRevisedProject();
    }
}

