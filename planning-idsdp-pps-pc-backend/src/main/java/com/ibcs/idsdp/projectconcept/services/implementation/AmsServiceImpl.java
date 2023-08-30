package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.projectconcept.web.dto.request.AmsUnapprovedProjectRequestDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.AmsUnapprovedProjectResponseDTO;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@AllArgsConstructor
@Transactional
public class AmsServiceImpl {

    private final ProjectConceptMasterServiceImp pcMasterService;

    public AmsUnapprovedProjectResponseDTO amsUnapprovedProjectEntry(AmsUnapprovedProjectRequestDTO request) {
        return pcMasterService.amsUnapprovedProjectEntry(request);
    }
}

