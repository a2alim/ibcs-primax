package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.projectconcept.model.domain.LinkageAndTarget;
import com.ibcs.idsdp.projectconcept.model.repositories.LinkageAndTargetRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.services.LinkageAndTargetService;
import com.ibcs.idsdp.projectconcept.web.dto.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class LinkageAndTargetServiceImp extends BaseService<LinkageAndTarget, LinkageAndTargetDTO> implements LinkageAndTargetService {

    private final LinkageAndTargetRepository linkageAndTargetRepository;
    private final ProjectConceptMasterRepository projectConceptMasterRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentRepository attachmentRepository;

    public LinkageAndTargetServiceImp(LinkageAndTargetRepository linkageAndTargetRepository,
                                      ProjectConceptMasterRepository projectConceptMasterRepository,
                                      IdGeneratorComponent idGeneratorComponent, AttachmentRepository attachmentRepository) {
        super(linkageAndTargetRepository);
        this.linkageAndTargetRepository = linkageAndTargetRepository;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentRepository = attachmentRepository;
    }

    /**
     * For create linkage and target
     * @param linkageAndTargetDTO
     * @param projectSummaryId
     * @return linkageAndTargetDTO
     */
    @Override
    public LinkageAndTargetDTO createLinkageTarget(LinkageAndTargetDTO linkageAndTargetDTO, Long projectSummaryId) {
        try {
//            LinkageAndTargetDTO linkageAndTargetDTO1 = new LinkageAndTargetDTO();
            List<LinkageAndTargetSdgsListDTO> linkageAndTargetSdgListDTOList = linkageAndTargetDTO.linkageTargetSdgs;
            for(LinkageAndTargetSdgsListDTO linkageAndTargetSdgsListDTO: linkageAndTargetSdgListDTOList) {
                if(!linkageAndTargetSdgsListDTO.getGoals().isEmpty() || !linkageAndTargetSdgsListDTO.getTargets().isEmpty() || !linkageAndTargetSdgsListDTO.getIndicator().isEmpty() || linkageAndTargetSdgsListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetSdgsListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetSdgsListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetSdgsListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetSdgsListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetSdgsListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }

            List<LinkageAndTargetFiveYearListDTO> linkageAndTargetFiveYearListDTOList = linkageAndTargetDTO.linkageTargetFiveYear;
            for(LinkageAndTargetFiveYearListDTO linkageAndTargetFiveYearListDTO: linkageAndTargetFiveYearListDTOList) {
                if(!linkageAndTargetFiveYearListDTO.getGoals().isEmpty() || !linkageAndTargetFiveYearListDTO.getTargets().isEmpty() || !linkageAndTargetFiveYearListDTO.getIndicator().isEmpty() || linkageAndTargetFiveYearListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetFiveYearListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetFiveYearListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetFiveYearListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetFiveYearListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetFiveYearListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }

            List<LinkageAndTargetPerspectiveListDTO> linkageAndTargetPerspectiveListDTOList = linkageAndTargetDTO.linkageTargetPerspectivePlan;
            for(LinkageAndTargetPerspectiveListDTO linkageAndTargetPerspectiveListDTO: linkageAndTargetPerspectiveListDTOList) {
                if(!linkageAndTargetPerspectiveListDTO.getGoals().isEmpty() || !linkageAndTargetPerspectiveListDTO.getTargets().isEmpty() || !linkageAndTargetPerspectiveListDTO.getIndicator().isEmpty() || linkageAndTargetPerspectiveListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetPerspectiveListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetPerspectiveListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetPerspectiveListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetPerspectiveListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetPerspectiveListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }

            List<LinkageAndTargetDeltaPlanListDTO> linkageAndTargetDeltaPlanListDTOList = linkageAndTargetDTO.linkageTargetDeltaPlan;
            for(LinkageAndTargetDeltaPlanListDTO linkageAndTargetDeltaPlanListDTO: linkageAndTargetDeltaPlanListDTOList) {
                if(!linkageAndTargetDeltaPlanListDTO.getGoals().isEmpty() || !linkageAndTargetDeltaPlanListDTO.getTargets().isEmpty() || !linkageAndTargetDeltaPlanListDTO.getIndicator().isEmpty() || linkageAndTargetDeltaPlanListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetDeltaPlanListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetDeltaPlanListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetDeltaPlanListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetDeltaPlanListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetDeltaPlanListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }

            List<LinkageAndTargetClimateListDTO> linkageAndTargetClimateListDTOList = linkageAndTargetDTO.linkageTargetClimate;
            for(LinkageAndTargetClimateListDTO linkageAndTargetClimateListDTO: linkageAndTargetClimateListDTOList) {
                if(!linkageAndTargetClimateListDTO.getGoals().isEmpty() || !linkageAndTargetClimateListDTO.getTargets().isEmpty() || !linkageAndTargetClimateListDTO.getIndicator().isEmpty() || linkageAndTargetClimateListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetClimateListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetClimateListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetClimateListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetClimateListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetClimateListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }

            List<LinkageAndTargetPovertyListDTO> linkageAndTargetPovertyListDTOList = linkageAndTargetDTO.linkageTargetPoverty;
            for(LinkageAndTargetPovertyListDTO linkageAndTargetPovertyListDTO: linkageAndTargetPovertyListDTOList) {
                if(!linkageAndTargetPovertyListDTO.getGoals().isEmpty() || !linkageAndTargetPovertyListDTO.getTargets().isEmpty() || !linkageAndTargetPovertyListDTO.getIndicator().isEmpty() || linkageAndTargetPovertyListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetPovertyListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetPovertyListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetPovertyListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetPovertyListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetPovertyListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }

            List<LinkageAndTargetGenderListDTO> linkageAndTargetGenderListDTOList = linkageAndTargetDTO.linkageTargetGender;
            for(LinkageAndTargetGenderListDTO linkageAndTargetGenderListDTO: linkageAndTargetGenderListDTOList) {
                if(!linkageAndTargetGenderListDTO.getGoals().isEmpty() || !linkageAndTargetGenderListDTO.getTargets().isEmpty() || !linkageAndTargetGenderListDTO.getIndicator().isEmpty() || linkageAndTargetGenderListDTO.getAttachmentId() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetGenderListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetGenderListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetGenderListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetGenderListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetGenderListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
            return linkageAndTargetDTO;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * For get linkage and target
     * @param id
     */
    @Override
    public LinkageAndTargetDTO getLinkageAndTargetListByProject(Long id) {
        LinkageAndTargetDTO dto = new LinkageAndTargetDTO();

         List<LinkageAndTargetSdgsListDTO> linkageTargetSdgs = new ArrayList<>();
         List<LinkageAndTargetFiveYearListDTO> linkageTargetFiveYear = new ArrayList<>();
         List<LinkageAndTargetPerspectiveListDTO> linkageTargetPerspectivePlan = new ArrayList<>();
         List<LinkageAndTargetDeltaPlanListDTO> linkageTargetDeltaPlan = new ArrayList<>();
         List<LinkageAndTargetClimateListDTO> linkageTargetClimate = new ArrayList<>();
         List<LinkageAndTargetPovertyListDTO> linkageTargetPoverty = new ArrayList<>();
         List<LinkageAndTargetGenderListDTO> linkageTargetGender = new ArrayList<>();

        List<LinkageAndTarget> linkageAndTargetList = linkageAndTargetRepository.findAllByProjectConceptMasterIdAndIsDeleted(id, false);
        for(LinkageAndTarget linkageAndTarget: linkageAndTargetList) {

            LinkageAndTargetSdgsListDTO linkageAndTargetSdgsListDTO = new LinkageAndTargetSdgsListDTO();
            if(linkageAndTarget.getType().equals("sdgs")) {
                linkageAndTargetSdgsListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetSdgsListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetSdgsListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetSdgsListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetSdgsListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetSdgsListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetSdgsListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetSdgsListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetSdgs.add(linkageAndTargetSdgsListDTO);
            }

            LinkageAndTargetFiveYearListDTO linkageAndTargetFiveYearListDTO = new LinkageAndTargetFiveYearListDTO();
            if(linkageAndTarget.getType().equals("fiveYearPlan")) {
                linkageAndTargetFiveYearListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetFiveYearListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetFiveYearListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetFiveYearListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetFiveYearListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetFiveYearListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetFiveYearListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetFiveYearListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetFiveYear.add(linkageAndTargetFiveYearListDTO);
            }

            LinkageAndTargetPerspectiveListDTO linkageAndTargetPerspectiveListDTO = new LinkageAndTargetPerspectiveListDTO();
            if(linkageAndTarget.getType().equals("perspectivePlan")) {
                linkageAndTargetPerspectiveListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetPerspectiveListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetPerspectiveListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetPerspectiveListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetPerspectiveListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetPerspectiveListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetPerspectiveListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetPerspectiveListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetPerspectivePlan.add(linkageAndTargetPerspectiveListDTO);
            }

            LinkageAndTargetDeltaPlanListDTO linkageAndTargetDeltaPlanListDTO = new LinkageAndTargetDeltaPlanListDTO();
            if(linkageAndTarget.getType().equals("deltaPlan")) {
                linkageAndTargetDeltaPlanListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetDeltaPlanListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetDeltaPlanListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetDeltaPlanListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetDeltaPlanListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetDeltaPlanListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetDeltaPlanListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetDeltaPlanListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetDeltaPlan.add(linkageAndTargetDeltaPlanListDTO);
            }

            LinkageAndTargetClimateListDTO linkageAndTargetClimateListDTO = new LinkageAndTargetClimateListDTO();
            if(linkageAndTarget.getType().equals("climate")) {
                linkageAndTargetClimateListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetClimateListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetClimateListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetClimateListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetClimateListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetClimateListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetClimateListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetClimateListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetClimate.add(linkageAndTargetClimateListDTO);
            }

            LinkageAndTargetPovertyListDTO linkageAndTargetPovertyListDTO = new LinkageAndTargetPovertyListDTO();
            if(linkageAndTarget.getType().equals("poverty")) {
                linkageAndTargetPovertyListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetPovertyListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetPovertyListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetPovertyListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetPovertyListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetPovertyListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetPovertyListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetPovertyListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetPoverty.add(linkageAndTargetPovertyListDTO);
            }

            LinkageAndTargetGenderListDTO linkageAndTargetGenderListDTO = new LinkageAndTargetGenderListDTO();
            if(linkageAndTarget.getType().equals("gender")) {
                linkageAndTargetGenderListDTO.setGoals(linkageAndTarget.getGoals());
                linkageAndTargetGenderListDTO.setTargets(linkageAndTarget.getTargets());
                linkageAndTargetGenderListDTO.setIndicator(linkageAndTarget.getIndicator());
                linkageAndTargetGenderListDTO.setType(linkageAndTarget.getType());
                linkageAndTargetGenderListDTO.setAttachmentId(linkageAndTarget.getAttachmentId());
                Optional<Attachment> attachmentOptional = attachmentRepository.findById(linkageAndTarget.getAttachmentId());
                if(attachmentOptional.isPresent()) {
                    Attachment attachment = attachmentOptional.get();
                    linkageAndTargetGenderListDTO.setAttachmentName(attachment.getName());
                }
                linkageAndTargetGenderListDTO.setProjectConceptMasterId(linkageAndTarget.getProjectConceptMaster().getId());
                linkageAndTargetGenderListDTO.setUuid(linkageAndTarget.getUuid());
                linkageTargetGender.add(linkageAndTargetGenderListDTO);
            }

            dto.linkageTargetSdgs = linkageTargetSdgs;
            dto.linkageTargetFiveYear = linkageTargetFiveYear;
            dto.linkageTargetPerspectivePlan = linkageTargetPerspectivePlan;
            dto.linkageTargetDeltaPlan = linkageTargetDeltaPlan;
            dto.linkageTargetClimate = linkageTargetClimate;
            dto.linkageTargetPoverty = linkageTargetPoverty;
            dto.linkageTargetGender = linkageTargetGender;

        }
        return dto;
    }

    /**
     * For update linkage and target
     * @param linkageAndTargetDTO
     * @param projectSummaryId
     * @return linkageAndTargetDTO
     */
    public LinkageAndTargetDTO updateLinkageAndTarget(LinkageAndTargetDTO linkageAndTargetDTO, Long projectSummaryId) {

        List<LinkageAndTargetSdgsListDTO> linkageAndTargetSdgListDTOList = linkageAndTargetDTO.linkageTargetSdgs;
        for(LinkageAndTargetSdgsListDTO linkageAndTargetSdgsListDTO: linkageAndTargetSdgListDTOList) {
            if(!linkageAndTargetSdgsListDTO.getGoals().isEmpty() || !linkageAndTargetSdgsListDTO.getTargets().isEmpty() || !linkageAndTargetSdgsListDTO.getIndicator().isEmpty() || linkageAndTargetSdgsListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetSdgsListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetSdgsListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetSdgsListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetSdgsListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetSdgsListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetSdgsListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetSdgsListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetSdgsListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetSdgsListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetSdgsListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetSdgsListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetSdgsListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        List<LinkageAndTargetFiveYearListDTO> linkageAndTargetFiveYearListDTOList = linkageAndTargetDTO.linkageTargetFiveYear;
        for(LinkageAndTargetFiveYearListDTO linkageAndTargetFiveYearListDTO: linkageAndTargetFiveYearListDTOList) {
            if(!linkageAndTargetFiveYearListDTO.getGoals().isEmpty() || !linkageAndTargetFiveYearListDTO.getTargets().isEmpty() || !linkageAndTargetFiveYearListDTO.getIndicator().isEmpty() || linkageAndTargetFiveYearListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetFiveYearListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetFiveYearListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetFiveYearListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetFiveYearListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetFiveYearListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetFiveYearListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetFiveYearListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetFiveYearListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetFiveYearListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetFiveYearListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetFiveYearListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetFiveYearListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        List<LinkageAndTargetPerspectiveListDTO> linkageAndTargetPerspectiveListDTOList = linkageAndTargetDTO.linkageTargetPerspectivePlan;
        for(LinkageAndTargetPerspectiveListDTO linkageAndTargetPerspectiveListDTO: linkageAndTargetPerspectiveListDTOList) {
            if(!linkageAndTargetPerspectiveListDTO.getGoals().isEmpty() || !linkageAndTargetPerspectiveListDTO.getTargets().isEmpty() || !linkageAndTargetPerspectiveListDTO.getIndicator().isEmpty() || linkageAndTargetPerspectiveListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetPerspectiveListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetPerspectiveListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetPerspectiveListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetPerspectiveListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetPerspectiveListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetPerspectiveListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetPerspectiveListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetPerspectiveListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetPerspectiveListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetPerspectiveListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetPerspectiveListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetPerspectiveListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        List<LinkageAndTargetDeltaPlanListDTO> linkageAndTargetDeltaPlanListDTOList = linkageAndTargetDTO.linkageTargetDeltaPlan;
        for(LinkageAndTargetDeltaPlanListDTO linkageAndTargetDeltaPlanListDTO: linkageAndTargetDeltaPlanListDTOList) {
            if(!linkageAndTargetDeltaPlanListDTO.getGoals().isEmpty() || !linkageAndTargetDeltaPlanListDTO.getTargets().isEmpty() || !linkageAndTargetDeltaPlanListDTO.getIndicator().isEmpty() || linkageAndTargetDeltaPlanListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetDeltaPlanListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetDeltaPlanListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetDeltaPlanListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetDeltaPlanListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetDeltaPlanListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetDeltaPlanListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetDeltaPlanListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetDeltaPlanListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetDeltaPlanListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetDeltaPlanListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetDeltaPlanListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetDeltaPlanListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        List<LinkageAndTargetClimateListDTO> linkageAndTargetClimateListDTOList = linkageAndTargetDTO.linkageTargetClimate;
        for(LinkageAndTargetClimateListDTO linkageAndTargetClimateListDTO: linkageAndTargetClimateListDTOList) {
            if(!linkageAndTargetClimateListDTO.getGoals().isEmpty() || !linkageAndTargetClimateListDTO.getTargets().isEmpty() || !linkageAndTargetClimateListDTO.getIndicator().isEmpty() || linkageAndTargetClimateListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetClimateListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetClimateListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetClimateListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetClimateListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetClimateListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetClimateListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetClimateListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetClimateListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetClimateListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetClimateListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetClimateListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetClimateListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        List<LinkageAndTargetPovertyListDTO> linkageAndTargetPovertyListDTOList = linkageAndTargetDTO.linkageTargetPoverty;
        for(LinkageAndTargetPovertyListDTO linkageAndTargetPovertyListDTO: linkageAndTargetPovertyListDTOList) {
            if(!linkageAndTargetPovertyListDTO.getGoals().isEmpty() || !linkageAndTargetPovertyListDTO.getTargets().isEmpty() || !linkageAndTargetPovertyListDTO.getIndicator().isEmpty() || linkageAndTargetPovertyListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetPovertyListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetPovertyListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetPovertyListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetPovertyListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetPovertyListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetPovertyListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetPovertyListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetPovertyListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetPovertyListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetPovertyListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetPovertyListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetPovertyListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        List<LinkageAndTargetGenderListDTO> linkageAndTargetGenderListDTOList = linkageAndTargetDTO.linkageTargetGender;
        for(LinkageAndTargetGenderListDTO linkageAndTargetGenderListDTO: linkageAndTargetGenderListDTOList) {
            if(!linkageAndTargetGenderListDTO.getGoals().isEmpty() || !linkageAndTargetGenderListDTO.getTargets().isEmpty() || !linkageAndTargetGenderListDTO.getIndicator().isEmpty() || linkageAndTargetGenderListDTO.getAttachmentId() != null) {
                if(!linkageAndTargetGenderListDTO.getUuid().isEmpty()){
                    Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(linkageAndTargetGenderListDTO.getUuid());
                    LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
                    linkageAndTarget.setGoals(linkageAndTargetGenderListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetGenderListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetGenderListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetGenderListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetGenderListDTO.getAttachmentId());
                    linkageAndTargetRepository.save(linkageAndTarget);
                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    LinkageAndTarget linkageAndTarget = new LinkageAndTarget();
                    linkageAndTarget.setIsDeleted(false);
                    linkageAndTarget.setUuid(uuid);
                    linkageAndTarget.setCreatedOn(LocalDate.now());
                    linkageAndTarget.setGoals(linkageAndTargetGenderListDTO.getGoals());
                    linkageAndTarget.setTargets(linkageAndTargetGenderListDTO.getTargets());
                    linkageAndTarget.setIndicator(linkageAndTargetGenderListDTO.getIndicator());
                    linkageAndTarget.setType(linkageAndTargetGenderListDTO.getType());
                    linkageAndTarget.setAttachmentId(linkageAndTargetGenderListDTO.getAttachmentId());
                    linkageAndTarget.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    linkageAndTargetRepository.save(linkageAndTarget);
                }
            }
        }

        return null;
    }

    /**
     * For delete linkage and target
     * @param uuid
     */
    public String deleteLinkageAndTarget(String uuid){
        Optional<LinkageAndTarget> linkageAndTargetOptional = linkageAndTargetRepository.findByUuid(uuid);
        LinkageAndTarget linkageAndTarget = linkageAndTargetOptional.get();
        linkageAndTarget.setIsDeleted(true);
        linkageAndTargetRepository.save(linkageAndTarget);
        return "Deleted" + uuid;
    }

    
}
