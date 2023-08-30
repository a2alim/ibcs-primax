package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.common.web.dto.response.ProjectConceptResponse;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.services.*;
import com.ibcs.idsdp.dpptapp.web.dto.request.PlisRequestDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.*;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


@Service
@AllArgsConstructor
@Transactional
public class PlisServiceImpl implements PlisService {

    private final ProjectConceptClientService projectConceptClientService;

    @Override
    public ResponseStatusDTO savePlisPdfUrl(PlisRequestDTO request) {
        ProjectConceptResponse pcInfo = projectConceptClientService.savePlisPdfUrl(request);
        if (pcInfo == null) {
            return new ResponseStatusDTO("fail", "PDF Url save failed!");
        }
        return new ResponseStatusDTO("success", "PDF Url save successfully!");
    }
}

