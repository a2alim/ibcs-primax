package com.ibcs.idsdp.rdpprtapp.services.implementation;

import com.ibcs.idsdp.common.model.domain.Attachment;
import com.ibcs.idsdp.common.services.AttachmentUploadService;
import com.ibcs.idsdp.rdpprtapp.model.domain.DppTappPresentation;
import com.ibcs.idsdp.rdpprtapp.model.repositories.DppTappPresentationRepository;
import com.ibcs.idsdp.rdpprtapp.services.DppTappPresentationService;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.DppTappPresentationDto;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDate;
import java.util.List;
import java.util.UUID;

@AllArgsConstructor
@Service
public class DppTappPresentationServiceImpl implements DppTappPresentationService {

    DppTappPresentationRepository dppTappPresentationRepository;
    AttachmentUploadService attachmentUploadService;

    @Override
    public DppTappPresentation addNewPresentation(DppTappPresentationDto dppTappPresentationDto, MultipartFile presentationFile) {
        DppTappPresentation dppTappPresentation = new DppTappPresentation();
        BeanUtils.copyProperties(dppTappPresentationDto, dppTappPresentation);
        Attachment attachment = attachmentUploadService.upload(presentationFile);
        dppTappPresentation.setAttachment(attachment);
        dppTappPresentation.setUuid(UUID.randomUUID().toString());
        dppTappPresentation.setCreatedOn(LocalDate.now());
        dppTappPresentation.setIsDeleted(false);
        dppTappPresentationRepository.save(dppTappPresentation);
        return dppTappPresentation;
    }

    @Override
    public List<DppTappPresentation> getPresentationBySource(Long sourceId, String sourceModule) {
        List<DppTappPresentation> dppTappPresentations = dppTappPresentationRepository.findBySourceIdAndSourceModule(sourceId,sourceModule);
        return dppTappPresentations;
    }
}
