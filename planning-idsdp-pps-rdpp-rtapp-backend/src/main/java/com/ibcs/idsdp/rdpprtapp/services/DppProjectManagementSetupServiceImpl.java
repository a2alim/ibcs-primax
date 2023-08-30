package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppProjectManagementSetup;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppProjectManagementSetupMaster;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppProjectManagementSetupMasterRepository;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppProjectManagementSetupRepository;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.*;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.BeanUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.*;

@Slf4j
@Service
@Transactional
public class DppProjectManagementSetupServiceImpl extends BaseService<DppProjectManagementSetup, DppProjectManagementSetupDto> implements DppProjectManagementSetupService {

    private final DppProjectManagementSetupRepository dppProjectManagementSetupRepository;
    private final IdGeneratorComponent idGeneratorComponent;
    private final DppObjectiveCostRepository objectiveCostRepository;
    private final DppProjectManagementSetupMasterRepository dppProjectManagementSetupMasterRepository;
    private final AttachmentRepository attachmentRepository;

    public DppProjectManagementSetupServiceImpl(ServiceRepository<DppProjectManagementSetup> repository,
                                                DppProjectManagementSetupRepository dppProjectManagementSetupRepository,
                                                IdGeneratorComponent idGeneratorComponent,
                                                DppObjectiveCostRepository objectiveCostRepository,
                                                AttachmentRepository attachmentRepository,
                                                DppProjectManagementSetupMasterRepository dppProjectManagementSetupMasterRepository) {
        super(repository);
        this.dppProjectManagementSetupRepository = dppProjectManagementSetupRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.objectiveCostRepository = objectiveCostRepository;
        this.attachmentRepository = attachmentRepository;
        this.dppProjectManagementSetupMasterRepository = dppProjectManagementSetupMasterRepository;
    }

    /**
     * For create
     * @param projectManagementSetupDto
     * @return
     */
    @Override
    public DppProjectManagementSetupDto createProjectSetup(DppProjectManagementSetupDto projectManagementSetupDto) {
        try {

            /* save organogram attachment */

            saveProjectManagementSetupOrganogramAttachment(projectManagementSetupDto);


            /*----------- save type of existing setup ----------------- */
            List<DppPMSExistingRequest> existingList = projectManagementSetupDto.existingSetup;
            for (DppPMSExistingRequest request : existingList) {
                if (!request.getNameOfThePost().isEmpty() || request.getProjectConceptUuid() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    DppProjectManagementSetup projectSetup = new DppProjectManagementSetup();
                    DppObjectiveCost masterId = objectiveCostRepository.findByProjectConceptUuid(request.getProjectConceptUuid());
                    projectSetup.setObjectiveCost(masterId);
                    projectSetup.setIsDeleted(false);
                    projectSetup.setUuid(uuid);
                    projectSetup.setCreatedBy("admin");
                    projectSetup.setCreatedOn(LocalDate.now());
                    projectSetup.setNameOfThePost(request.getNameOfThePost());
                    projectSetup.setQuantity(request.getQuantity());
                    projectSetup.setQualification(request.getQualification());
                    projectSetup.setModeOfRecruitment(request.getModeOfRecruitment());
                    projectSetup.setScale_amount(request.getScale_amount());
                    projectSetup.setPayGrade(request.getPayGrade());
                    projectSetup.setTypes("existing"); // set type
                    projectSetup.setProjectConceptUuid(request.getProjectConceptUuid());
                    projectSetup.setProjectConceptId(request.getProjectConceptId());
                    projectSetup.setResponsibility(request.getResponsibility());
                    projectSetup.setRemarks(request.getRemarks());
                    dppProjectManagementSetupRepository.save(projectSetup);
                }
            }

            /*----------- save type of execution setup ----------------- */
            List<DppPMSExecutionRequest> executionList = projectManagementSetupDto.executionSetup;
            for (DppPMSExecutionRequest request : executionList) {
                if (!request.getNameOfThePost().isEmpty() || request.getProjectConceptUuid() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    DppProjectManagementSetup projectSetup = new DppProjectManagementSetup();
                    DppObjectiveCost masterId = objectiveCostRepository.findByProjectConceptUuid(request.getProjectConceptUuid());
                    projectSetup.setObjectiveCost(masterId);
                    projectSetup.setIsDeleted(false);
                    projectSetup.setUuid(uuid);
                    projectSetup.setCreatedBy("admin");
                    projectSetup.setCreatedOn(LocalDate.now());
                    projectSetup.setNameOfThePost(request.getNameOfThePost());
                    projectSetup.setQuantity(request.getQuantity());
                    projectSetup.setQualification(request.getQualification());
                    projectSetup.setModeOfRecruitment(request.getModeOfRecruitment());
                    projectSetup.setScale_amount(request.getScale_amount());
                    projectSetup.setPayGrade(request.getPayGrade());
                    projectSetup.setTypes("execution"); // set type
                    projectSetup.setProjectConceptUuid(request.getProjectConceptUuid());
                    projectSetup.setProjectConceptId(request.getProjectConceptId());
                    projectSetup.setResponsibility(request.getResponsibility());
                    projectSetup.setRemarks(request.getRemarks());
                    dppProjectManagementSetupRepository.save(projectSetup);
                }
            }

            /*----------- save type of outsourcing ----------------- */
            List<DppPMSOutsourcingRequest> outsourcing = projectManagementSetupDto.outSourcing;
            for (DppPMSOutsourcingRequest request : outsourcing) {
                if (!request.getNameOfThePost().isEmpty() || request.getProjectConceptUuid() != null) {
                    String uuid = idGeneratorComponent.generateUUID();
                    DppProjectManagementSetup projectSetup = new DppProjectManagementSetup();
                    DppObjectiveCost masterId = objectiveCostRepository.findByProjectConceptUuid(request.getProjectConceptUuid());
                    projectSetup.setObjectiveCost(masterId);
                    projectSetup.setIsDeleted(false);
                    projectSetup.setUuid(uuid);
                    projectSetup.setCreatedBy("admin");
                    projectSetup.setCreatedOn(LocalDate.now());
                    projectSetup.setNameOfThePost(request.getNameOfThePost());
                    projectSetup.setQuantity(request.getQuantity());
                    projectSetup.setQualification(request.getQualification());
                    projectSetup.setModeOfRecruitment(request.getModeOfRecruitment());
                    projectSetup.setScale_amount(request.getScale_amount());
                    projectSetup.setPayGrade(request.getPayGrade());
                    projectSetup.setTypes("outsoutcing"); // set type
                    projectSetup.setProjectConceptUuid(request.getProjectConceptUuid());
                    projectSetup.setProjectConceptId(request.getProjectConceptId());
                    projectSetup.setResponsibility(request.getResponsibility());
                    projectSetup.setRemarks(request.getRemarks());
                    dppProjectManagementSetupRepository.save(projectSetup);
                }
            }
            return projectManagementSetupDto;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /**
     * For create
     * @param projectManagementSetupDto
     * @return
     */
    @Override
    public DppProjectManagementSetupDto updateProjectSetup(DppProjectManagementSetupDto projectManagementSetupDto) {


        /* update organogram attachment */

        saveProjectManagementSetupOrganogramAttachment(projectManagementSetupDto);


        /*----------- update type of existing setup ----------------- */
        List<DppPMSExistingRequest> existingRequests = projectManagementSetupDto.existingSetup;
        for(DppPMSExistingRequest pmsExistingRequest: existingRequests) {
            if(pmsExistingRequest.getTypes() != null || pmsExistingRequest.getNameOfThePost() != null || pmsExistingRequest.getScale_amount() != null) {
                if(pmsExistingRequest.getUuid() != null){
                    Optional<DppProjectManagementSetup> setupOptional = dppProjectManagementSetupRepository.findByUuid(pmsExistingRequest.getUuid());
                    DppProjectManagementSetup managementSetup = setupOptional.get();
                    managementSetup.setUpdatedBy("admin");
                    managementSetup.setUpdatedOn(LocalDate.now());
                    BeanUtils.copyProperties(pmsExistingRequest, managementSetup);
                    dppProjectManagementSetupRepository.save(managementSetup);
                } else {
                    /*----------- save type of existing setup new row ----------------- */
                    String uuid = idGeneratorComponent.generateUUID();
                    DppProjectManagementSetup existingSetup = new DppProjectManagementSetup();
                    DppObjectiveCost masterId = objectiveCostRepository.findByProjectConceptUuid(pmsExistingRequest.getProjectConceptUuid());
                    existingSetup.setObjectiveCost(masterId);
                    existingSetup.setIsDeleted(false);
                    existingSetup.setUuid(uuid);
                    existingSetup.setCreatedBy("admin");
                    existingSetup.setCreatedOn(LocalDate.now());
                    existingSetup.setNameOfThePost(pmsExistingRequest.getNameOfThePost());
                    existingSetup.setQuantity(pmsExistingRequest.getQuantity());
                    existingSetup.setQualification(pmsExistingRequest.getQualification());
                    existingSetup.setModeOfRecruitment(pmsExistingRequest.getModeOfRecruitment());
                    existingSetup.setScale_amount(pmsExistingRequest.getScale_amount());
                    existingSetup.setPayGrade(pmsExistingRequest.getPayGrade());
                    existingSetup.setTypes("existing"); // set type
                    existingSetup.setProjectConceptUuid(pmsExistingRequest.getProjectConceptUuid());
                    existingSetup.setProjectConceptId(pmsExistingRequest.getProjectConceptId());
                    existingSetup.setResponsibility(pmsExistingRequest.getResponsibility());
                    existingSetup.setRemarks(pmsExistingRequest.getRemarks());
                    dppProjectManagementSetupRepository.save(existingSetup);
                }
            }
        }
        /*----------- update type of execution setup data ----------------- */
        List<DppPMSExecutionRequest> executionSetup = projectManagementSetupDto.executionSetup;
        for(DppPMSExecutionRequest pmsExecutionRequest: executionSetup) {
            if(pmsExecutionRequest.getTypes() != null || pmsExecutionRequest.getNameOfThePost() != null || pmsExecutionRequest.getScale_amount() != null) {
                if(pmsExecutionRequest.getUuid() != null){
                    Optional<DppProjectManagementSetup> setupOptional = dppProjectManagementSetupRepository.findByUuid(pmsExecutionRequest.getUuid());
                    DppProjectManagementSetup managementSetup = setupOptional.get();
                    managementSetup.setUpdatedBy("admin");
                    managementSetup.setUpdatedOn(LocalDate.now());
                    BeanUtils.copyProperties(pmsExecutionRequest, managementSetup);
                    dppProjectManagementSetupRepository.save(managementSetup);
                } else {
                    /*----------- save type of execution setup new row ----------------- */
                    String uuid = idGeneratorComponent.generateUUID();
                    DppProjectManagementSetup setup = new DppProjectManagementSetup();
                    DppObjectiveCost masterId = objectiveCostRepository.findByProjectConceptUuid(pmsExecutionRequest.getProjectConceptUuid());
                    setup.setObjectiveCost(masterId);
                    setup.setIsDeleted(false);
                    setup.setUuid(uuid);
                    setup.setCreatedBy("admin");
                    setup.setCreatedOn(LocalDate.now());
                    setup.setNameOfThePost(pmsExecutionRequest.getNameOfThePost());
                    setup.setQuantity(pmsExecutionRequest.getQuantity());
                    setup.setQualification(pmsExecutionRequest.getQualification());
                    setup.setModeOfRecruitment(pmsExecutionRequest.getModeOfRecruitment());
                    setup.setScale_amount(pmsExecutionRequest.getScale_amount());
                    setup.setPayGrade(pmsExecutionRequest.getPayGrade());
                    setup.setTypes("execution"); // set type
                    setup.setProjectConceptUuid(pmsExecutionRequest.getProjectConceptUuid());
                    setup.setProjectConceptId(pmsExecutionRequest.getProjectConceptId());
                    setup.setResponsibility(pmsExecutionRequest.getResponsibility());
                    setup.setRemarks(pmsExecutionRequest.getRemarks());
                    dppProjectManagementSetupRepository.save(setup);
                }
            }
        }

        /*----------- update type of outsourcing setup ----------------- */
        List<DppPMSOutsourcingRequest> outsourcingRequests = projectManagementSetupDto.outSourcing;
        for(DppPMSOutsourcingRequest pmsOutsourcingRequest: outsourcingRequests) {
            if(pmsOutsourcingRequest.getTypes() != null || pmsOutsourcingRequest.getNameOfThePost() != null || pmsOutsourcingRequest.getScale_amount() != null) {
                if(pmsOutsourcingRequest.getUuid() != null){
                    Optional<DppProjectManagementSetup> setupOptional = dppProjectManagementSetupRepository.findByUuid(pmsOutsourcingRequest.getUuid());
                    DppProjectManagementSetup managementSetup = setupOptional.get();
                    managementSetup.setUpdatedBy("admin");
                    managementSetup.setUpdatedOn(LocalDate.now());
                    managementSetup.setIsDeleted(false);
                    BeanUtils.copyProperties(pmsOutsourcingRequest, managementSetup);
                    dppProjectManagementSetupRepository.save(managementSetup);
                } else {
                    /*----------- save type of outsourcing setup new row ----------------- */
                    String uuid = idGeneratorComponent.generateUUID();
                    DppProjectManagementSetup outSourcing = new DppProjectManagementSetup();
                    DppObjectiveCost masterId = objectiveCostRepository.findByProjectConceptUuid(pmsOutsourcingRequest.getProjectConceptUuid());
                    outSourcing.setObjectiveCost(masterId);
                    outSourcing.setIsDeleted(false);
                    outSourcing.setUuid(uuid);
                    outSourcing.setCreatedBy("admin");
                    outSourcing.setCreatedOn(LocalDate.now());
                    outSourcing.setNameOfThePost(pmsOutsourcingRequest.getNameOfThePost());
                    outSourcing.setQuantity(pmsOutsourcingRequest.getQuantity());
                    outSourcing.setQualification(pmsOutsourcingRequest.getQualification());
                    outSourcing.setModeOfRecruitment(pmsOutsourcingRequest.getModeOfRecruitment());
                    outSourcing.setScale_amount(pmsOutsourcingRequest.getScale_amount());
                    outSourcing.setPayGrade(pmsOutsourcingRequest.getPayGrade());
                    outSourcing.setTypes("outsoutcing"); // set type
                    outSourcing.setProjectConceptUuid(pmsOutsourcingRequest.getProjectConceptUuid());
                    outSourcing.setProjectConceptId(pmsOutsourcingRequest.getProjectConceptId());
                    outSourcing.setResponsibility(pmsOutsourcingRequest.getResponsibility());
                    outSourcing.setRemarks(pmsOutsourcingRequest.getRemarks());
                    dppProjectManagementSetupRepository.save(outSourcing);
                }
            }
        }

        return null;

    }

    /**
     * For create
     * @param pcUuid
     * @return
     */
    @Override
    public ResponseWithResults getProjectSetupListByProject(String pcUuid) {
        DppProjectManagementSetupDto dto = new DppProjectManagementSetupDto();

        List<DppPMSExistingRequest> existingRequest = new ArrayList<>();
        List<DppPMSExecutionRequest> executionRequest = new ArrayList<>();
        List<DppPMSOutsourcingRequest> outsourcingRequest = new ArrayList<>();

        List<DppProjectManagementSetup> managementSetup =
                dppProjectManagementSetupRepository.findAllByProjectConceptUuidAndIsDeleted(pcUuid, false);

        for(DppProjectManagementSetup projectManagementSetup : managementSetup){
            /*----------- get type of existing setup list ----------------- */
            DppPMSExistingRequest pmsExistingRequest = new DppPMSExistingRequest();
                if(projectManagementSetup.getTypes().equals("existing")) {
                    BeanUtils.copyProperties(projectManagementSetup, pmsExistingRequest);
                    existingRequest.add(pmsExistingRequest);
                }

            /*----------- get type of execution setup list ----------------- */
            DppPMSExecutionRequest pmsExecutionRequest = new DppPMSExecutionRequest();
                if(projectManagementSetup.getTypes().equals("execution")) {
                    BeanUtils.copyProperties(projectManagementSetup, pmsExecutionRequest);
                    executionRequest.add(pmsExecutionRequest);
                }

            /*----------- get type of outsourcing list ----------------- */
            DppPMSOutsourcingRequest pmsOutsourcingRequest = new DppPMSOutsourcingRequest();
                if(projectManagementSetup.getTypes().equals("outsoutcing")) {
                    BeanUtils.copyProperties(projectManagementSetup, pmsOutsourcingRequest);
                    outsourcingRequest.add(pmsOutsourcingRequest);
                }

            dto.existingSetup = existingRequest;
            dto.executionSetup = executionRequest;
            dto.outSourcing = outsourcingRequest;
            dto.setDppProjectManagementSetupMasterId(managementSetup.get(0).getId());
        }


        return new ResponseWithResults(1, "Success", dto);
    }

    @Override
    public String deleteProjectSetup(String projectId) {

        Optional<DppProjectManagementSetup> optional = dppProjectManagementSetupRepository.findByUuid(projectId);

        DppProjectManagementSetup setup = optional.get();
        setup.setIsDeleted(true);

        dppProjectManagementSetupRepository.save(setup);
        //return "delete" + projectId;
        return projectId;
    }

    /**
     * For delete
     * @param uuid
     * @return
     */
    public ResponseEntity<ResponseStatus> deleteRow(String uuid){
       // dppProjectManagementSetupRepository.delete(dppProjectManagementSetupRepository.findByUuid(uuid).get());

        Optional<DppProjectManagementSetup> optional = dppProjectManagementSetupRepository.findByUuid(uuid);
        DppProjectManagementSetup setup = optional.get();
        setup.setIsDeleted(true);
        dppProjectManagementSetupRepository.save(setup);

        return new ResponseEntity( new ResponseStatus(1, "Deleted successfully"), HttpStatus.OK);
    }

    @Override
    public ResponseWithResults getProjectMannagementOrganogramAttachment(String uuid) {
        Optional<DppProjectManagementSetupMaster> dppProjectManagementSetupMasterOptional = dppProjectManagementSetupMasterRepository.findByProjectConceptUuid(uuid);
        if(dppProjectManagementSetupMasterOptional.isPresent()) {
            DppProjectManagementSetupMaster dppProjectManagementSetupMaster = dppProjectManagementSetupMasterOptional.get();
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(dppProjectManagementSetupMaster.getAttachmentId());
            if(attachmentOptional.isPresent()) {
                Attachment attachment = attachmentOptional.get();
                var map = new HashMap<>();
                map.put("attachment",attachment);
                return new ResponseWithResults(200, "Success", map);
            }
        }
        return new ResponseWithResults(404, "Data Not Found", "");
    }


    public void saveProjectManagementSetupOrganogramAttachment(DppProjectManagementSetupDto projectManagementSetupDto) {
        if (projectManagementSetupDto.getAttachmentId() != null) {
            String uuid = idGeneratorComponent.generateUUID();
            Optional<DppProjectManagementSetupMaster> dppProjectManagementSetupMasterOptional = dppProjectManagementSetupMasterRepository.findByProjectConceptUuid(projectManagementSetupDto.getPcUuid());
            if (dppProjectManagementSetupMasterOptional.isPresent()) {
                DppProjectManagementSetupMaster dppProjectManagementSetupMaster = dppProjectManagementSetupMasterOptional.get();
                dppProjectManagementSetupMaster.setAttachmentId(projectManagementSetupDto.getAttachmentId());
                dppProjectManagementSetupMaster.setIsDeleted(false);
                dppProjectManagementSetupMaster.setUuid(uuid);
                dppProjectManagementSetupMaster.setCreatedBy("admin");
                dppProjectManagementSetupMaster.setCreatedOn(LocalDate.now());
                dppProjectManagementSetupMasterRepository.save(dppProjectManagementSetupMaster);
            } else {
                DppProjectManagementSetupMaster dppProjectManagementSetupMaster = new DppProjectManagementSetupMaster();
                dppProjectManagementSetupMaster.setProjectConceptUuid(projectManagementSetupDto.getPcUuid());
                dppProjectManagementSetupMaster.setIsDeleted(false);
                dppProjectManagementSetupMaster.setUuid(uuid);
                dppProjectManagementSetupMaster.setCreatedBy("admin");
                dppProjectManagementSetupMaster.setCreatedOn(LocalDate.now());
                dppProjectManagementSetupMaster.setAttachmentId(projectManagementSetupDto.getAttachmentId());
                dppProjectManagementSetupMasterRepository.save(dppProjectManagementSetupMaster);
            }
        }
    }
}





