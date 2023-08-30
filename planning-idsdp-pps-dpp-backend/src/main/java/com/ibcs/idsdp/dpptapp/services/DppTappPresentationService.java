package com.ibcs.idsdp.dpptapp.services;

import com.ibcs.idsdp.dpptapp.model.domain.DppTappPresentation;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppTappPresentationDto;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface DppTappPresentationService {
    DppTappPresentation addNewPresentation(DppTappPresentationDto dppTappPresentationDto, MultipartFile presentationFile);

    List<DppTappPresentation> getPresentationBySource(Long sourceId, String sourceModule);
}
