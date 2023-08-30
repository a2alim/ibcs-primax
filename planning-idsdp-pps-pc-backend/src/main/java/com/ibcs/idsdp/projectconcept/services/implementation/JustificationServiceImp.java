package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.model.repositories.AttachmentRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.projectconcept.model.domain.Justification;
import com.ibcs.idsdp.projectconcept.model.repositories.JustificationRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.services.JustificationService;
import com.ibcs.idsdp.projectconcept.web.dto.JustificationDTO;
import com.ibcs.idsdp.projectconcept.web.dto.JustificationListDto;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Slf4j
@Service
public class JustificationServiceImp extends BaseService<Justification, JustificationDTO> implements JustificationService {
    private JustificationRepository justificationRepository;
    private ProjectConceptMasterRepository projectConceptMasterRepository;
    private IdGeneratorComponent idGeneratorComponent;
    private AttachmentRepository attachmentRepository;

    protected JustificationServiceImp(JustificationRepository repository, ProjectConceptMasterRepository projectConceptMasterRepository, IdGeneratorComponent idGeneratorComponent, AttachmentRepository attachmentRepository) {
        super(repository);
        this.justificationRepository = repository;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.idGeneratorComponent = idGeneratorComponent;
        this.attachmentRepository = attachmentRepository;
    }

    /*
     * Create Justification
     * @param justificationDTO
     * @param projectSummaryId
     * @return JustificationDTO
     */

    @Override
    public ResponseEntity<ResponseStatus> createJustification(JustificationDTO justificationDTO, Long projectSummaryId) {
        try {
            List<JustificationListDto> justificationListDtos = justificationDTO.justification;
            for(JustificationListDto justificationListDto: justificationListDtos) {
                String uuid = idGeneratorComponent.generateUUID();
                Justification justification = new Justification();
                justification.setIsDeleted(false);
                justification.setUuid(uuid);
                justification.setCreatedOn(LocalDate.now());
                justification.setDescription(justificationListDto.getDescription());
                justification.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                justification.setTypeId(justificationListDto.getJustification());
                justification.setAttachmentId(justificationListDto.getAttachmentId());
                justificationRepository.save(justification);
            }
            return new ResponseEntity(new ResponseStatus(201,"resource created successfully"), HttpStatus.CREATED);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return null;
    }

    /*
     * Get Justification List By Project Id
     * @param id
     * @return List<JustificationListDto>
     */

    @Override
    public List<JustificationListDto> getJustificationListByProject(Long id) {
        List<JustificationListDto> justificationListDtos = new ArrayList<>();
        List<Justification> justificationList = justificationRepository.findAllByProjectConceptMasterIdAndIsDeleted(id, false);
        for(Justification justification: justificationList) {
            JustificationListDto justificationListDto = new JustificationListDto();
            justificationListDto.setJustification(justification.getTypeId());
            justificationListDto.setAttachmentId(justification.getAttachmentId());
            Optional<Attachment> attachmentOptional = attachmentRepository.findById(justification.getAttachmentId());
            if(attachmentOptional.isPresent()) {
                Attachment attachment = attachmentOptional.get();
                justificationListDto.setAttachmentName(attachment.getName());
            }
            justificationListDto.setDescription(justification.getDescription());
            justificationListDto.setUuid(justification.getUuid());
            justificationListDtos.add(justificationListDto);
        }
        return justificationListDtos;
    }

    /*
     * Update for Justification
     * @param id
     * @return JustificationDTO
     */


    public ResponseEntity<ResponseStatus> updateJustification(JustificationDTO justificationDTO, Long projectSummaryId) {

        try {
            List<JustificationListDto> justificationListDto = justificationDTO.justification;
            for(JustificationListDto justificationRequest: justificationListDto) {
                if(!justificationRequest.getUuid().isEmpty()) {
                    Optional<Justification> justificationOptional = justificationRepository.findByUuid(justificationRequest.getUuid());
                    if(justificationOptional.isPresent()) {
                        Justification justification = justificationOptional.get();
                        justification.setTypeId(justificationRequest.getJustification());
                        justification.setDescription(justificationRequest.getDescription());
                        justification.setAttachmentId(justificationRequest.getAttachmentId());
                        justificationRepository.save(justification);
                    }

                } else {
                    String uuid = idGeneratorComponent.generateUUID();
                    Justification justification = new Justification();
                    justification.setIsDeleted(false);
                    justification.setUuid(uuid);
                    justification.setCreatedBy("user");
                    justification.setCreatedOn(LocalDate.now());
                    justification.setDescription(justificationRequest.getDescription());
                    justification.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectSummaryId, false).get());
                    justification.setTypeId(justificationRequest.getJustification());
                    justification.setAttachmentId(justificationRequest.getAttachmentId());
                    justificationRepository.save(justification);
                }

            }
            return new ResponseEntity(new ResponseStatus(200,"resource updated successfully"), HttpStatus.OK);
        }
        catch (Exception e) {
            e.printStackTrace();
        }
       return null;
    }
}
