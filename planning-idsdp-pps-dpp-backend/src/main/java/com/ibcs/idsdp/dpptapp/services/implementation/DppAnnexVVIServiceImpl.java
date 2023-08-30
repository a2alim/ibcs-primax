package com.ibcs.idsdp.dpptapp.services.implementation;

import com.ibcs.idsdp.dpptapp.model.domain.DppAnnexVVI;
import com.ibcs.idsdp.dpptapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.dpptapp.model.domain.ProjectDetailsPartB;
import com.ibcs.idsdp.dpptapp.model.repositories.DppAnnexVVIRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.ProjectDetailsPartBRepository;
import com.ibcs.idsdp.dpptapp.services.DppAnnexVVIService;
import com.ibcs.idsdp.dpptapp.web.dto.request.DppAnnexVVIRequest;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

@Service
@AllArgsConstructor
@Transactional
public class DppAnnexVVIServiceImpl implements DppAnnexVVIService {
    ProjectDetailsPartBRepository projectDetailsPartBRepository;
    private DppAnnexVVIRepository dppAnnexVVIRepository;
    DppObjectiveCostRepository masterTableRepo;

    // For Create AnnexVVI Attachment
    @Override
    public DppAnnexVVI saveAnnexVVI(DppAnnexVVIRequest dppAnnexVVIRequest) {
        DppAnnexVVI dppAnnexVVI = new DppAnnexVVI();
        BeanUtils.copyProperties(dppAnnexVVIRequest,dppAnnexVVI);
        DppObjectiveCost masterData = masterTableRepo.findByProjectConceptUuid(dppAnnexVVIRequest.getProjectConceptUuid());
        dppAnnexVVI.setObjectiveCost(masterData);
        dppAnnexVVI.setProjectConceptMasterId(masterData.getProjectConceptMasterId());
        dppAnnexVVI.setCreatedBy("admin");
        dppAnnexVVI.setCreatedOn(LocalDate.now());
        dppAnnexVVI.setIsDeleted(false);
        dppAnnexVVI.setUuid(UUID.randomUUID().toString());
        DppAnnexVVI newDppAnnexVVI = dppAnnexVVIRepository.save(dppAnnexVVI);
        return newDppAnnexVVI;
    }

    // for Udpate AnnexVVI Attachement
    @Override
    public Boolean update(DppAnnexVVI dppAnnexVVI) {
        dppAnnexVVIRepository.save(dppAnnexVVI);
        return true;
    }

    // For get AnnexVVI Attachmet by Project id
    @Override
    public DppAnnexVVI getAnnexV_VIByProjectId(String projectId) {

        Optional<DppAnnexVVI> dppAnnexVVIOptional = dppAnnexVVIRepository.findByProjectConceptUuid(projectId);
        if(dppAnnexVVIOptional.isPresent()) {
            DppAnnexVVI dppAnnexVVI = dppAnnexVVIOptional.get();
            return dppAnnexVVI;
        }
        return null;
    }

    @Override
    public DppAnnexVVI updateAnnexV_VI(DppAnnexVVIRequest annexVVIRequest, String id) {
        Optional<DppAnnexVVI> annexVVI = dppAnnexVVIRepository.findByProjectConceptUuid(id);

        if (!annexVVI.isPresent()){
            throw new RuntimeException("Other details Not Found");
        }
        DppAnnexVVI dppAnnexVVI = annexVVI.get();

        dppAnnexVVI.setUpdatedBy("admin");
        dppAnnexVVI.setUpdatedOn(LocalDate.now());
        BeanUtils.copyProperties(annexVVIRequest, annexVVI);
        DppAnnexVVI vvi = dppAnnexVVIRepository.save(dppAnnexVVI);
        return vvi;
    }
}
