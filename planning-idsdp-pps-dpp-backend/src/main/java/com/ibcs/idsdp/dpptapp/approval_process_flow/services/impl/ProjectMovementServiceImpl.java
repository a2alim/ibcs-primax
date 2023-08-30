package com.ibcs.idsdp.dpptapp.approval_process_flow.services.impl;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.common.web.dto.request.IdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.EcnecConditions;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.MovementStageEnum;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementAttachment;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.domain.ProjectMovementStage;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.EcnecConditionsRepository;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.ProjectMovementAttachmentRepository;
import com.ibcs.idsdp.dpptapp.approval_process_flow.model.repositories.ProjectMovementRepository;
import com.ibcs.idsdp.dpptapp.approval_process_flow.services.ProjectMovementService;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request.EcnecConditionsRequest;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.request.ProjectMovementStageRequest;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.MeetingPaperResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.ProjectMovementStageResponse;
import com.ibcs.idsdp.dpptapp.approval_process_flow.web.dto.response.RemainingTimeConditionResponse;
import com.ibcs.idsdp.dpptapp.client.FSClientService;
import com.ibcs.idsdp.dpptapp.client.PpsRdppRtappClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.response.FspSummaryDTO;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.TappObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.TappObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.services.DppObjectiveCostServiceImp;
import com.ibcs.idsdp.dpptapp.services.TappObjectiveCostServiceImp;
import com.ibcs.idsdp.dpptapp.web.dto.DppObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.TappObjectiveCostDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.ApprovedDppTappResponseDto;
import com.ibcs.idsdp.dpptapp.web.dto.response.ProjectMovementStageDTO;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.util.CollectionUtils;
import org.springframework.web.multipart.MultipartFile;

import javax.transaction.Transactional;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;

@Slf4j
@AllArgsConstructor
@Transactional
@Service
public class ProjectMovementServiceImpl implements ProjectMovementService {
    ProjectMovementRepository projectMovementRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private final AttachmentUploadService attachmentUploadService;
    private final ProjectMovementAttachmentRepository projectMovementAttachmentRepository;
    DppObjectiveCostRepository dppObjectiveCostRepository;
    TappObjectiveCostRepository tappObjectiveCostRepository;
    EcnecConditionsRepository ecnecConditionsRepository;
    PpsRdppRtappClientService rdppRtappClientService;
    private final ProjectConceptClientService projectConceptService;
    private final DppObjectiveCostServiceImp dppObjectiveCostService;
    private final TappObjectiveCostServiceImp tappObjectiveCostService;
    private final FSClientService fsClientService;

    @Override
    public ProjectMovementStage saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest) {

        Long projectConceptMasterId = 0L;
        MovementStageEnum movementStageEnum = MovementStageEnum.valueOf(projectMovementStageRequest.getCurrentStage());

        List<ProjectMovementStage> projectMovementStageOptional = new ArrayList<>();
        if (projectMovementStageRequest != null && projectMovementStageRequest.getCurrentStage() != null){
            if (projectMovementStageRequest.getProjectConceptMasterId() != null){
                projectConceptMasterId = projectMovementStageRequest.getProjectConceptMasterId();
                projectMovementStageOptional = projectMovementRepository.findByProjectConceptMasterIdAndCurrentStageOrderByMovementTimeDesc(projectMovementStageRequest.getProjectConceptMasterId(), movementStageEnum);
            } else if(projectMovementStageRequest.getFsProposalMasterId() != null){
                FspSummaryDTO fspSummary = fsClientService.getFspSummaryById(projectMovementStageRequest.getFsProposalMasterId());
                projectConceptMasterId = fspSummary.getProjectConceptMasterId();
                projectMovementStageOptional = projectMovementRepository.findByFsProposalMasterIdAndCurrentStageOrderByMovementTimeDesc(projectMovementStageRequest.getFsProposalMasterId(), movementStageEnum);
            } else if (projectMovementStageRequest.getDppMasterId() != null) {
                DppObjectiveCostDTO dpp = dppObjectiveCostService.getById(projectMovementStageRequest.getDppMasterId());
                projectConceptMasterId = dpp.getProjectConceptMasterId();
                projectMovementStageOptional = projectMovementRepository.findByDppMasterIdAndCurrentStageOrderByMovementTimeDesc(projectMovementStageRequest.getDppMasterId(), movementStageEnum);
            } else if (projectMovementStageRequest.getTappMasterId() != null) {
                TappObjectiveCostDTO tapp = tappObjectiveCostService.getById(projectMovementStageRequest.getTappMasterId());
                projectConceptMasterId = tapp.getProjectConceptMasterId();
                projectMovementStageOptional = projectMovementRepository.findByTappMasterIdAndCurrentStageOrderByMovementTimeDesc(projectMovementStageRequest.getTappMasterId(), movementStageEnum);
            } else if (projectMovementStageRequest.getRdppMasterId() != null) {
                Optional<DppObjectiveCost> rdpp = rdppRtappClientService.findRdppById(projectMovementStageRequest.getRdppMasterId());
                projectConceptMasterId = rdpp.get().getProjectConceptMasterId();
                projectMovementStageOptional = projectMovementRepository.findByRdppMasterIdAndCurrentStageOrderByMovementTimeDesc(projectMovementStageRequest.getRdppMasterId(), movementStageEnum);
            } else if (projectMovementStageRequest.getRtappMasterId() != null) {
                Optional<TappObjectiveCost> rtapp = rdppRtappClientService.findRtappById(projectMovementStageRequest.getRtappMasterId());
                projectConceptMasterId = rtapp.get().getProjectConceptMasterId();
                projectMovementStageOptional = projectMovementRepository.findByRtappMasterIdAndCurrentStageOrderByMovementTimeDesc(projectMovementStageRequest.getRtappMasterId(), movementStageEnum);
            }

//            if(!CollectionUtils.isEmpty(projectMovementStageOptional) && movementStageEnum != MovementStageEnum.MINISTRY_DESK
//                    && movementStageEnum != MovementStageEnum.PLANNING_COMMISSION_HEAD && movementStageEnum != MovementStageEnum.AGENCY_DESK)
            if (!CollectionUtils.isEmpty(projectMovementStageOptional)
                    && (movementStageEnum == MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE
                        || movementStageEnum == MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD
                        || movementStageEnum == MovementStageEnum.DPEC_MEETING_NOTICE
                        || movementStageEnum == MovementStageEnum.DPEC_MEETING_HELD
                        || movementStageEnum == MovementStageEnum.DSPEC_MEETING_NOTICE
                        || movementStageEnum == MovementStageEnum.DSPEC_MEETING_HELD
                        || movementStageEnum == MovementStageEnum.PEC_MEETING_NOTICE
                        || movementStageEnum == MovementStageEnum.PEC_MEETING_HELD
                        || movementStageEnum == MovementStageEnum.SPEC_MEETING_NOTICE
                        || movementStageEnum == MovementStageEnum.SPEC_MEETING_HELD))
                return projectMovementStageOptional.get(0);
        }

        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
        BeanUtils.copyProperties(projectMovementStageRequest, projectMovementStage);
        projectMovementStage.setCurrentStage(movementStageEnum);
        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
        projectMovementStage.setIsDeleted(false);
        LocalDateTime localDateTime = LocalDateTime.now();
        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
        projectMovementStage.setMovementTime(localDateTime);
        try {
            projectMovementStage = projectMovementRepository.save(projectMovementStage);
            IdHolderRequestBodyDTO request = new IdHolderRequestBodyDTO();
            request.setId(projectConceptMasterId);
            projectConceptService.updateMovementTimeByPcId(request);
            log.info("saved projectMovementStage");
        } catch (Exception ex) {
            log.info("failed projectMovementStage");
        }
        return projectMovementStage;

    }

//    @Override
//    public ProjectMovementStage saveNewMovement(ProjectMovementStageRequest projectMovementStageRequest) {
//        ProjectMovementStage projectMovementStage = new ProjectMovementStage();
//        BeanUtils.copyProperties(projectMovementStageRequest, projectMovementStage);
//        MovementStageEnum movementStageEnum = MovementStageEnum.valueOf(projectMovementStageRequest.getCurrentStage());
//        projectMovementStage.setCurrentStage(movementStageEnum);
//        projectMovementStage.setUuid(idGeneratorComponent.generateUUID());
//        projectMovementStage.setIsDeleted(false);
//        LocalDateTime localDateTime = LocalDateTime.now();
//        projectMovementStage.setCreatedOn(localDateTime.toLocalDate());
//        projectMovementStage.setMovementTime(localDateTime);
//        try {
//            projectMovementStage = projectMovementRepository.save(projectMovementStage);
//            log.info("saved projectMovementStage");
//        } catch (Exception ex) {
//            log.info("failed projectMovementStage");
//        }
//        return projectMovementStage;
//
//    }

    @Override
    public ProjectMovementStage getCurrentStageInDpp(Long dppMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(dppMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public ProjectMovementStageDTO getCurrentStageDTOInDpp(Long dppMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(dppMasterId);
        if (!projectMovementStageList.isEmpty()) {
            ProjectMovementStage currentStage = projectMovementStageList.get(0);
            ProjectMovementStageDTO currentStageDTO = new ProjectMovementStageDTO();
            BeanUtils.copyProperties(currentStage, currentStageDTO);
            if (projectMovementStageList.size()>1) currentStageDTO.setPreviousStage(projectMovementStageList.get(1).getCurrentStage());
            return currentStageDTO;
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInTapp(Long tappMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(tappMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public ProjectMovementStageDTO getCurrentStageDTOInTapp(Long tappMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(tappMasterId);
        if (!projectMovementStageList.isEmpty()) {
            ProjectMovementStage currentStage = projectMovementStageList.get(0);
            ProjectMovementStageDTO currentStageDTO = new ProjectMovementStageDTO();
            BeanUtils.copyProperties(currentStage, currentStageDTO);
            if (projectMovementStageList.size()>1) currentStageDTO.setPreviousStage(projectMovementStageList.get(1).getCurrentStage());
            return currentStageDTO;
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInProjectConcept(Long pcMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByProjectConceptMasterIdOrderByMovementTimeDesc(pcMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public List<ProjectMovementStage> getAllStageByUserId(Long userId) {
        List<ProjectMovementStage> projectMovementStages = projectMovementRepository.findByUserId(userId);
        return projectMovementStages.isEmpty() ? new ArrayList<>() : projectMovementStages;
    }

    @Override
    public List<ProjectMovementStageResponse> getAllStageByMasterId(String source, Long masterId) {
        List<ProjectMovementStage> projectMovementStageList = null;
        if (source.equalsIgnoreCase("dpp")) {
            projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(masterId);
        } else if (source.equalsIgnoreCase("tapp")) {
            projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(masterId);
        } else if (source.equalsIgnoreCase("pc")) {
            projectMovementStageList = projectMovementRepository.findByProjectConceptMasterIdOrderByMovementTimeDesc(masterId);
        } else if (source.equalsIgnoreCase("fs")) {
            projectMovementStageList = projectMovementRepository.findByFsProposalMasterIdOrderByMovementTimeDesc(masterId);
        }
        if (projectMovementStageList != null) {
            return projectMovementStageList.stream().map(e -> new ProjectMovementStageResponse() {{
                setCurrentStage(e.getCurrentStage());
                setMovementDate(e.getMovementTime().toLocalDate());
                setMovementTime(e.getMovementTime().toLocalTime());
            }}).collect(Collectors.toList());
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInRDpp(Long rdppMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(rdppMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

    @Override
    public ProjectMovementStage getCurrentStageInRTapp(Long rtappMasterId) {
        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(rtappMasterId);
        if (!projectMovementStageList.isEmpty()) {
            return projectMovementStageList.get(0);
        } else
            return null;
    }

//    @Override
//    public MeetingPaperResponse checkAllMeetingPaperAttachment(Long projectMovementStageId) {
//        boolean valid = false;
//        MeetingPaperResponse meetingPaperResponse = null;
//        ProjectMovementStage projectMovementStage = projectMovementRepository.findById(projectMovementStageId).get();
//        List<ProjectMovementStage> projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(projectMovementStage.getDppMasterId());
//
//        if(projectMovementStage.getCurrentStage().equals(MovementStageEnum.PEC_MEETING_HELD)){
//            List<ProjectMovementAttachment> projectMovementAttachmentList = projectMovementAttachmentRepository.findByProjectMovementStageIdAndAndPaperType(projectMovementStage.getId(), "PEC Meeting Working Paper");
//            if(!projectMovementAttachmentList.isEmpty()){
//                ProjectMovementAttachment projectMovementAttachment = projectMovementAttachmentList.get(0);
//                if(projectMovementAttachment.getProjectMovementStage().getId().longValue() == projectMovementStage.getId().longValue()) {
//                    valid = true;
//                    meetingPaperResponse = new MeetingPaperResponse("planning",valid);
//                }
//                else{
//                    Optional<ProjectMovementStage> optProjectMovementStage =  projectMovementStageList.stream().filter(pMStage -> pMStage.getCurrentStage().equals(MovementStageEnum.PEC_MEETING_NOTICE)).findFirst();
//                    if(optProjectMovementStage.isPresent()){
//                        projectMovementAttachmentList = projectMovementAttachmentRepository.findByProjectMovementStageIdAndAndPaperType(projectMovementStage.getId(), "PEC Meeting Working Paper");
//                        projectMovementAttachment = projectMovementAttachmentList.get(0);
//                        if(projectMovementAttachment.getProjectMovementStage().getId().longValue() == projectMovementStage.getId().longValue()) {
//                            valid = true;
//                            meetingPaperResponse = meetingPaperResponse = new MeetingPaperResponse("planning",valid);
//                        }
//                    }
//                }
//            }
//        }
//        else if(projectMovementStage.getCurrentStage().equals(MovementStageEnum.DPEC_MEETING_HELD) || projectMovementStage.getCurrentStage().equals(MovementStageEnum.DSPEC_MEETING_HELD) || projectMovementStage.getCurrentStage().equals(MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD)){
//
//           long count = projectMovementStageList.stream().filter(pMStage -> pMStage.getCurrentStage().equals(MovementStageEnum.MINISTRY_HEAD) || pMStage.getCurrentStage().equals(MovementStageEnum.MINISTRY_DESK)).count();
//
//           long halfCount = count/2;
//
//            List<ProjectMovementAttachment> projectMovementAttachmentList = new ArrayList<>();
//
//            projectMovementStageList.forEach(pmStage -> {
//                System.out.println(pmStage.getCurrentStage() + "," + pmStage.getId());
//                List<ProjectMovementAttachment> list = projectMovementAttachmentRepository.findByProjectMovementStageIdAndPaperTypeIsNotNull(pmStage.getId());
//                projectMovementAttachmentList.addAll(list);
//            });
//            long paperCountDPEC = 0, paperCountPSC = 0, paperCountPEC = 0;
//            for(ProjectMovementAttachment projectMovementAttachment : projectMovementAttachmentList){
//                if(projectMovementAttachment.getPaperType().equals("DPEC Meeting Working Paper")){
//                    paperCountDPEC++;
//                }
//                else if(projectMovementAttachment.getPaperType().equals("PSC Meeting Working Paper")){
//                    paperCountPSC++;
//                }
//
//            }
//            long paperCount = paperCountDPEC + paperCountPSC;
//            if(paperCount >= (halfCount*2)){
//                if(paperCountDPEC >=halfCount && paperCountPSC >=halfCount) {
//                    valid = true;
//                }
//
//            }
//            meetingPaperResponse = new MeetingPaperResponse("ministry",valid);
//        }
//        return meetingPaperResponse;
//    }

//    @Override
//    public MeetingPaperResponse checkAllMeetingPaperAttachment(Long projectMovementStageId) {
//        boolean valid = false;
//        MeetingPaperResponse meetingPaperResponse = null;
//        ProjectMovementStage projectMovementStage = projectMovementRepository.findById(projectMovementStageId).get();
//        List<ProjectMovementStage> projectMovementStageList = new ArrayList<>();
//
//        if(projectMovementStage.getTappMasterId() != null){
//            projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(projectMovementStage.getTappMasterId());
//
//        } else if(projectMovementStage.getDppMasterId() != null){
//            projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(projectMovementStage.getDppMasterId());
//
//        } else if(projectMovementStage.getRtappMasterId() != null){
//            projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(projectMovementStage.getRtappMasterId());
//
//        } else if(projectMovementStage.getRdppMasterId() != null){
//            projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(projectMovementStage.getRdppMasterId());
//        }
//
//        if(projectMovementStage.getCurrentStage().equals(MovementStageEnum.PEC_MEETING_HELD) || projectMovementStage.getCurrentStage().equals(MovementStageEnum.SPEC_MEETING_HELD)){
//            List<ProjectMovementAttachment> projectMovementAttachmentList = projectMovementAttachmentRepository.findByProjectMovementStageIdAndAndPaperType(projectMovementStage.getId(), "PEC Meeting Working Paper");
//            if(!projectMovementAttachmentList.isEmpty()){
//                ProjectMovementAttachment projectMovementAttachment = projectMovementAttachmentList.get(0);
//                if(projectMovementAttachment.getProjectMovementStage().getId().longValue() == projectMovementStage.getId().longValue()) {
//                    valid = true;
//                    return new MeetingPaperResponse("planning",valid);
//                } else {
//                    Optional<ProjectMovementStage> optProjectMovementStage =  projectMovementStageList.stream().filter(pMStage -> pMStage.getCurrentStage().equals(MovementStageEnum.PEC_MEETING_NOTICE)).findFirst();
//                    if(optProjectMovementStage.isPresent()){
//                        projectMovementAttachmentList = projectMovementAttachmentRepository.findByProjectMovementStageIdAndAndPaperType(projectMovementStage.getId(), "PEC Meeting Working Paper");
//                        projectMovementAttachment = projectMovementAttachmentList.get(0);
//                        if(projectMovementAttachment.getProjectMovementStage().getId().longValue() == projectMovementStage.getId().longValue()) {
//                            valid = true;
//                            return new MeetingPaperResponse("planning",valid);
//                        }
//                    }
//                }
//            }
//            projectMovementAttachmentList = projectMovementAttachmentRepository.findByProjectMovementStageIdAndAndPaperType(projectMovementStage.getId(), "SPEC Meeting Working Paper");
//            if(!projectMovementAttachmentList.isEmpty()){
//                ProjectMovementAttachment projectMovementAttachment = projectMovementAttachmentList.get(0);
//                if(projectMovementAttachment.getProjectMovementStage().getId().longValue() == projectMovementStage.getId().longValue()) {
//                    valid = true;
//                    return new MeetingPaperResponse("planning",valid);
//                }
//                else{
//                    Optional<ProjectMovementStage> optProjectMovementStage =  projectMovementStageList.stream().filter(pMStage -> pMStage.getCurrentStage().equals(MovementStageEnum.SPEC_MEETING_NOTICE)).findFirst();
//                    if(optProjectMovementStage.isPresent()){
//                        projectMovementAttachmentList = projectMovementAttachmentRepository.findByProjectMovementStageIdAndAndPaperType(projectMovementStage.getId(), "SPEC Meeting Working Paper");
//                        projectMovementAttachment = projectMovementAttachmentList.get(0);
//                        if(projectMovementAttachment.getProjectMovementStage().getId().longValue() == projectMovementStage.getId().longValue()) {
//                            valid = true;
//                            return new MeetingPaperResponse("planning",valid);
//                        }
//                    }
//                }
//            }
//        } else if(projectMovementStage.getCurrentStage().equals(MovementStageEnum.DPEC_MEETING_HELD) || projectMovementStage.getCurrentStage().equals(MovementStageEnum.DSPEC_MEETING_HELD) || projectMovementStage.getCurrentStage().equals(MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD)){
//
//           long count = projectMovementStageList.stream().filter(pMStage -> pMStage.getCurrentStage().equals(MovementStageEnum.MINISTRY_HEAD) || pMStage.getCurrentStage().equals(MovementStageEnum.MINISTRY_DESK)).count();
//
//           long halfCount = count/2;
//
//            List<ProjectMovementAttachment> projectMovementAttachmentList = new ArrayList<>();
//
//            projectMovementStageList.forEach(pmStage -> {
//                projectMovementAttachmentList.addAll(projectMovementAttachmentRepository.findByProjectMovementStageIdAndPaperTypeIsNotNull(pmStage.getId()));
//            });
//            long paperCountDPEC = 0, paperCountPSC = 0, paperCountPEC = 0, paperCountDSPEC = 0;
//            for(ProjectMovementAttachment projectMovementAttachment : projectMovementAttachmentList){
//                if(projectMovementAttachment.getPaperType().equals("DPEC Meeting Working Paper")){
//                    paperCountDPEC++;
//                }
//                else if(projectMovementAttachment.getPaperType().equals("PSC Meeting Working Paper")){
//                    paperCountPSC++;
//                }
//                else if(projectMovementAttachment.getPaperType().equals("DSPEC Meeting Working Paper")){
//                    paperCountDSPEC++;
//                }
//
//            }
//            long paperCount = paperCountDPEC + paperCountPSC + paperCountDSPEC;
//            if(paperCount >= (halfCount*2)){
//                if((paperCountDPEC >=halfCount && paperCountPSC >=halfCount) || (paperCountPSC >=halfCount && paperCountDSPEC >=halfCount) ) {
//                    valid = true;
//                }
//            }
//            meetingPaperResponse = new MeetingPaperResponse("ministry",valid);
//        }
//        return meetingPaperResponse;
//    }

    @Override
    public MeetingPaperResponse checkAllMeetingPaperAttachment(Long projectMovementStageId) {

        boolean pscWorkingPaper = false, isPscNotice = false, isPscMinutes = false;
        ProjectMovementStage projectMovementStage = projectMovementRepository.findById(projectMovementStageId).get();
        List<ProjectMovementStage> projectMovementStageList = new ArrayList<>();

        if(projectMovementStage.getTappMasterId() != null){
            projectMovementStageList = projectMovementRepository.findByTappMasterIdOrderByMovementTimeDesc(projectMovementStage.getTappMasterId());

        } else if(projectMovementStage.getDppMasterId() != null){
            projectMovementStageList = projectMovementRepository.findByDppMasterIdOrderByMovementTimeDesc(projectMovementStage.getDppMasterId());

        } else if(projectMovementStage.getRtappMasterId() != null){
            projectMovementStageList = projectMovementRepository.findByRtappMasterIdOrderByMovementTimeDesc(projectMovementStage.getRtappMasterId());

        } else if(projectMovementStage.getRdppMasterId() != null){
            projectMovementStageList = projectMovementRepository.findByRdppMasterIdOrderByMovementTimeDesc(projectMovementStage.getRdppMasterId());
        }

        if (!CollectionUtils.isEmpty(projectMovementStageList)){

            List<ProjectMovementAttachment> projectMovementAttachmentList = new ArrayList<>();
            for(ProjectMovementStage pmStage: projectMovementStageList) {

                if (pmStage.getCurrentStage().equals(MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_NOTICE)) {
                    isPscNotice = true;
                } else if (pmStage.getCurrentStage().equals(MovementStageEnum.PROJECT_SCRUTINY_COMMITTEE_MEETING_HELD)) {
                    isPscMinutes = true;
                }
                projectMovementAttachmentList.addAll(projectMovementAttachmentRepository.findByProjectMovementStageIdAndPaperTypeIsNotNull(pmStage.getId()));
            };
            pscWorkingPaper = projectMovementAttachmentList.stream().anyMatch(pma -> pma.getPaperType().equals("PSC Meeting Working Paper"));

            if(pscWorkingPaper && isPscNotice && isPscMinutes){
               return new MeetingPaperResponse("ministry", pscWorkingPaper);
            }

        }
        return new MeetingPaperResponse("ministry", false);
    }

    @Override
    public EcnecConditions saveEcnecConditions(EcnecConditionsRequest ecnecConditionsRequest, MultipartFile multipartFile) {
        Attachment attachment = null;
        if (multipartFile != null) {
            attachment = attachmentUploadService.upload(multipartFile);
        }
        ProjectMovementStage projectMovementStage;
        Optional<ProjectMovementStage> optProjectMovementStage = projectMovementRepository.findById(ecnecConditionsRequest.getProjectMovementStageId());
        if(optProjectMovementStage.isPresent()){
            projectMovementStage = optProjectMovementStage.get();
            ProjectMovementAttachment projectMovementAttachment = new ProjectMovementAttachment();
            projectMovementAttachment.setProjectMovementStage(projectMovementStage);
            EcnecConditions ecnecConditions = new EcnecConditions();
            String uuid = UUID.randomUUID().toString();
            ecnecConditions.setUuid(uuid);
            ecnecConditions.setProjectMovementStage(projectMovementStage);
            ecnecConditions.setConditions(ecnecConditionsRequest.getConditions());
            ecnecConditions.setAttachment(attachment);
            ecnecConditions.setCreatedOn(LocalDate.now());
            ecnecConditions.setIsDeleted(false);
            ecnecConditionsRepository.save(ecnecConditions);
            return ecnecConditions;
        }
        else
            return null;


    }

    @Override
    public ProjectMovementStage getProjectMovementStage(Long id) {
        Optional<ProjectMovementStage> optProjectMovementStage = projectMovementRepository.findById(id);
        if (optProjectMovementStage.isPresent())
            return optProjectMovementStage.get();
        else
            return null;
    }

    @Override
    public ResponseWithResults saveProjectMovementAttachment(MultipartFile multipartFile, ProjectMovementStage projectMovementStage, String paperType) {
        Attachment attachment = null;
        if (multipartFile != null) {
            attachment = attachmentUploadService.upload(multipartFile);
        }
        ProjectMovementAttachment projectMovementAttachment = new ProjectMovementAttachment();
        projectMovementAttachment.setProjectMovementStage(projectMovementStage);
        if (attachment != null) {
            projectMovementAttachment.setAttachment(attachment);
        }
        projectMovementAttachment.setUuid(idGeneratorComponent.generateUUID());
        projectMovementAttachment.setIsDeleted(false);
        projectMovementAttachment.setCreatedOn(LocalDate.now());
        projectMovementAttachment.setPaperType(paperType);
        projectMovementAttachmentRepository.save(projectMovementAttachment);
        return new ResponseWithResults(200, "Successfully Save Data", projectMovementAttachment);
    }

    @Override
    public List<ProjectMovementStage> getMinistryApprovedProjectConceptList() {
        return projectMovementRepository.findByCurrentStageAndProjectConceptMasterIdIsNotNull(MovementStageEnum.APPROVED_BY_MINISTRY);
    }

    @Override
    public List<ApprovedDppTappResponseDto> getMinistryApprovedDppTappProjectList() {
        List<MovementStageEnum> stages = Arrays.asList(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER, MovementStageEnum.APPROVED_BY_ECNEC, MovementStageEnum.APPROVED_BY_MINISTRY);
        List<ProjectMovementStage> projectMovementStages = projectMovementRepository.findAllByCurrentStageInAndIsDeleted(stages, false);
        List<ApprovedDppTappResponseDto> approvedDppTappResponseDtoList = new ArrayList<>();
        projectMovementStages.forEach( res -> {
            if (res.getDppMasterId() != null) {
                Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findById(res.getDppMasterId());
                if(dppObjectiveCost.isPresent()){
                    Optional<DppObjectiveCost> rdppObjectiveCost = rdppRtappClientService.findRdppByProjectConceptId(dppObjectiveCost.get().getProjectConceptMasterId());
                    if (rdppObjectiveCost.isEmpty()) {
                        ApprovedDppTappResponseDto approvedDppTappResponseDto = new ApprovedDppTappResponseDto();
                        BeanUtils.copyProperties(dppObjectiveCost.get(), approvedDppTappResponseDto);
                        approvedDppTappResponseDto.setDppTappType("DPP");
                        approvedDppTappResponseDtoList.add(approvedDppTappResponseDto);
                   }
               }
           }
           if (res.getTappMasterId() != null) {
               Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findById(res.getTappMasterId());
               if(tappObjectiveCost.isPresent()){
                   Optional<TappObjectiveCost> rtappObjectiveCost = rdppRtappClientService.findRtappByProjectConceptId(tappObjectiveCost.get().getProjectConceptMasterId());
                   if (rtappObjectiveCost.isEmpty()) {
                       ApprovedDppTappResponseDto approvedDppTappResponseDto = new ApprovedDppTappResponseDto();
                       BeanUtils.copyProperties(tappObjectiveCost.get(), approvedDppTappResponseDto);
                       approvedDppTappResponseDto.setDppTappType("TAPP");
                       approvedDppTappResponseDtoList.add(approvedDppTappResponseDto);
                   }
               }
           }
           if (res.getRdppMasterId() != null) {
               Optional<DppObjectiveCost> referenceRdppObjectiveCost = rdppRtappClientService.findRdppByReferenceId(res.getRdppMasterId());
               if (referenceRdppObjectiveCost.isEmpty()) {
                   Optional<DppObjectiveCost> rdppObjectiveCost = rdppRtappClientService.findRdppById(res.getRdppMasterId());
                   if (rdppObjectiveCost.isPresent()) {
                       ApprovedDppTappResponseDto approvedRdppTappResponseDto = new ApprovedDppTappResponseDto();
                       BeanUtils.copyProperties(rdppObjectiveCost.get(), approvedRdppTappResponseDto);
                       approvedRdppTappResponseDto.setDppTappType("RDPP");
                       approvedDppTappResponseDtoList.add(approvedRdppTappResponseDto);
                   }
               }
           }
           if (res.getRtappMasterId() != null) {
               Optional<TappObjectiveCost> referenceRtappObjectiveCost = rdppRtappClientService.findRtappByReferenceId(res.getRtappMasterId());
               if (referenceRtappObjectiveCost.isEmpty()) {
                   Optional<TappObjectiveCost> tappObjectiveCost = rdppRtappClientService.findRtappById(res.getRtappMasterId());
                   if (tappObjectiveCost.isPresent()) {
                       ApprovedDppTappResponseDto approvedRdppTappResponseDto = new ApprovedDppTappResponseDto();
                       BeanUtils.copyProperties(tappObjectiveCost.get(), approvedRdppTappResponseDto);
                       approvedRdppTappResponseDto.setDppTappType("RTAPP");
                       approvedDppTappResponseDtoList.add(approvedRdppTappResponseDto);
                   }
               }
           }
       });

       return approvedDppTappResponseDtoList;
    }

    @Override
    public List<ApprovedDppTappResponseDto> getApprovedProjectByAgencyId(Long agencyId) {
        List<MovementStageEnum> stages = Arrays.asList(MovementStageEnum.APPROVED_BY_PLANNING_MINISTER, MovementStageEnum.APPROVED_BY_ECNEC, MovementStageEnum.APPROVED_BY_MINISTRY);
        List<ProjectMovementStage> projectMovementStages = projectMovementRepository.findAllByCurrentStageInAndIsDeleted(stages, false);
        List<ApprovedDppTappResponseDto> approvedProjectList = new ArrayList<>();
        projectMovementStages.forEach( res -> {
            if (res.getDppMasterId() != null) {
                Optional<DppObjectiveCost> dppObjectiveCost = dppObjectiveCostRepository.findByIdAndAgencyIdAndIsDeleted(res.getDppMasterId(), agencyId, false);
                if(dppObjectiveCost.isPresent()){
                    Optional<DppObjectiveCost> rdppObjectiveCost = rdppRtappClientService.findRdppByProjectConceptId(dppObjectiveCost.get().getProjectConceptMasterId());
                    if (rdppObjectiveCost.isEmpty()) {
                        ApprovedDppTappResponseDto projectDTO = new ApprovedDppTappResponseDto();
                        BeanUtils.copyProperties(dppObjectiveCost.get(), projectDTO);
                        projectDTO.setDppTappType("DPP");
                        approvedProjectList.add(projectDTO);
                    }
                }
            }
            if (res.getTappMasterId() != null) {
                Optional<TappObjectiveCost> tappObjectiveCost = tappObjectiveCostRepository.findByIdAndAgencyIdAndIsDeleted(res.getTappMasterId(), agencyId, false);
                if(tappObjectiveCost.isPresent()){
                    Optional<TappObjectiveCost> rtappObjectiveCost = rdppRtappClientService.findRtappByProjectConceptId(tappObjectiveCost.get().getProjectConceptMasterId());
                    if (rtappObjectiveCost.isEmpty()) {
                        ApprovedDppTappResponseDto projectDTO = new ApprovedDppTappResponseDto();
                        BeanUtils.copyProperties(tappObjectiveCost.get(), projectDTO);
                        projectDTO.setDppTappType("TAPP");
                        approvedProjectList.add(projectDTO);
                    }
                }
            }
            if (res.getRdppMasterId() != null) {
                Optional<DppObjectiveCost> referenceRdppObjectiveCost = rdppRtappClientService.findRdppByReferenceIdAndAgencyId(res.getRdppMasterId(), agencyId);
                if (referenceRdppObjectiveCost.isEmpty()) {
                    Optional<DppObjectiveCost> rdppObjectiveCost = rdppRtappClientService.findRdppById(res.getRdppMasterId());
                    if (rdppObjectiveCost.isPresent()) {
                        ApprovedDppTappResponseDto projectDTO = new ApprovedDppTappResponseDto();
                        BeanUtils.copyProperties(rdppObjectiveCost.get(), projectDTO);
                        projectDTO.setDppTappType("RDPP");
                        approvedProjectList.add(projectDTO);
                    }
                }
            }
            if (res.getRtappMasterId() != null) {
                Optional<TappObjectiveCost> referenceRtappObjectiveCost = rdppRtappClientService.findRtappByReferenceIdAndAgencyId(res.getRtappMasterId(), agencyId);
                if (referenceRtappObjectiveCost.isEmpty()) {
                    Optional<TappObjectiveCost> tappObjectiveCost = rdppRtappClientService.findRtappById(res.getRtappMasterId());
                    if (tappObjectiveCost.isPresent()) {
                        ApprovedDppTappResponseDto projectDTO = new ApprovedDppTappResponseDto();
                        BeanUtils.copyProperties(tappObjectiveCost.get(), projectDTO);
                        projectDTO.setDppTappType("RTAPP");
                        approvedProjectList.add(projectDTO);
                    }
                }
            }
        });

        return approvedProjectList;
    }

    @Override
    public RemainingTimeConditionResponse getDppRemainingTimeCondition(ProjectMovementStageRequest projectMovementStageRequest) {
        boolean isCurrentStageMinistryDesk = false;
        boolean isEnableWarningTimer = false;
        ProjectMovementStage currentStageInDpp = getCurrentStageInDpp(projectMovementStageRequest.getDppMasterId());
        if(currentStageInDpp.getCurrentStage() == MovementStageEnum.MINISTRY_DESK) {
            isCurrentStageMinistryDesk = true;
        }
        List<ProjectMovementStage> projectMovementStage = projectMovementRepository.findAllByDppMasterIdAndCurrentStage(projectMovementStageRequest.getDppMasterId(), MovementStageEnum.MINISTRY_DESK);

        if(projectMovementStage.size() > 1 && isCurrentStageMinistryDesk) {
            isEnableWarningTimer = true;
        }

        RemainingTimeConditionResponse response = new RemainingTimeConditionResponse();
        response.setCurrentStage(currentStageInDpp.getCurrentStage());
        response.setEnableWarningTimer(isEnableWarningTimer);
        response.setMovementTime(currentStageInDpp.getMovementTime());
        LocalDateTime now = LocalDateTime.now();
        response.setCurrentTime(now);

        return response;
    }
}
