package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.response.ResponseStatus;
import com.ibcs.idsdp.common.web.dto.response.ResponseWithResults;
import com.ibcs.idsdp.feasibilitystudy.client.ProjectConceptClientService;
import com.ibcs.idsdp.feasibilitystudy.model.domain.FsSummary;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.FsSummaryRepository;
import com.ibcs.idsdp.feasibilitystudy.services.FsSummaryService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsLinkWithDto;
import com.ibcs.idsdp.feasibilitystudy.web.dto.FsSummaryDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.request.ProjectConceptShortInfoDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.util.List;
import java.util.Optional;


@Slf4j
@Service
public class FsSummaryServiceImp extends BaseService<FsSummary, FsSummaryDTO> implements FsSummaryService {

    private final FsSummaryRepository fsSummaryRepository;
    private final ProjectConceptClientService projectConceptClientService;

    public FsSummaryServiceImp(FsSummaryRepository fsSummaryRepository, ProjectConceptClientService projectConceptClientService) {
        super(fsSummaryRepository);
        this.fsSummaryRepository = fsSummaryRepository;
        this.projectConceptClientService = projectConceptClientService;
    }


    /**
     * Covert data for create
     * @param fsSummaryDTO
     * @return
     */
    @Override
    protected FsSummary convertForCreate(FsSummaryDTO fsSummaryDTO) {
        FsSummary fsSummary = fsSummaryRepository.findAllByProjectConceptMasterUuidAndIsDeleted(fsSummaryDTO.getProjectConceptMasterUuid(), false);
        if(fsSummary != null){
            fsSummaryDTO.setUuid(fsSummary.getUuid());
        }
        if (fsSummaryRepository.existsByProjectConceptMasterUuidAndIsDeleted(fsSummaryDTO.getProjectConceptMasterUuid(), false))
            super.updateEntity(fsSummaryDTO);
        FsSummary fsSummary1 = super.convertForCreate(fsSummaryDTO);
        return fsSummary1;
    }

    @Override
    public FsSummaryDTO create(FsSummaryDTO fsSummaryDTO) {
        updateProjectConceptShortInfo(fsSummaryDTO);
        return super.create(fsSummaryDTO);
    }

    @Override
    public FsSummaryDTO update(FsSummaryDTO fsSummaryDTO) {
        updateProjectConceptShortInfo(fsSummaryDTO);
        return super.update(fsSummaryDTO);
    }

    private void updateProjectConceptShortInfo(FsSummaryDTO fsSummaryDTO) {
        ProjectConceptShortInfoDTO request = new ProjectConceptShortInfoDTO();
        request.setPcUuid(fsSummaryDTO.getProjectConceptMasterUuid());
        request.setTitleEn(fsSummaryDTO.getTitle_en());
        request.setTitleBn(fsSummaryDTO.getTitle_bn());
        request.setCommencementDate(fsSummaryDTO.getDate_of_commencement().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        request.setCompletionDate(fsSummaryDTO.getDate_of_completion().toInstant().atZone(ZoneId.systemDefault()).toLocalDate());
        request.setSectorId(fsSummaryDTO.getSector_id());
        request.setSubSectorId(fsSummaryDTO.getSub_sector_id());
        projectConceptClientService.updateProjectShortInfo(request);
    }

    /**
     * For get fs report summary
     * @param projectConceptMasterUuid
     */
    @Override
    public FsSummaryDTO getFsSummaryByProjectConceptUuid(String projectConceptMasterUuid) {
        FsSummaryDTO fsSummaryDTO = new FsSummaryDTO();

        FsSummary fsSummary = fsSummaryRepository.findAllByProjectConceptMasterUuidAndIsDeleted(projectConceptMasterUuid, false);
        if(fsSummary != null){
            fsSummaryDTO.setTitle_en(fsSummary.getTitle_en());
            fsSummaryDTO.setTitle_bn(fsSummary.getTitle_bn());
            fsSummaryDTO.setSponsoringMinistry(fsSummary.getSponsoringMinistry());
            fsSummaryDTO.setExecutingAgency(fsSummary.getExecutingAgency());
            fsSummaryDTO.setProject_objectives(fsSummary.getProject_objectives());
            fsSummaryDTO.setEstimated_proj_cost(fsSummary.getEstimated_proj_cost());
            fsSummaryDTO.setSector_id(fsSummary.getSector_id());
            fsSummaryDTO.setSub_sector_id(fsSummary.getSub_sector_id());
            fsSummaryDTO.setProject_category_id(fsSummary.getProject_category_id());
            fsSummaryDTO.setDate_of_commencement(fsSummary.getDate_of_commencement());
            fsSummaryDTO.setDate_of_completion(fsSummary.getDate_of_completion());
            fsSummaryDTO.setUuid(fsSummary.getUuid());
            fsSummaryDTO.setId(fsSummary.getId());
            fsSummaryDTO.setProjectConceptMasterId(fsSummary.getProjectConceptMasterId());
            fsSummaryDTO.setParipatraVersionId(fsSummary.getParipatraVersionId());
            fsSummaryDTO.setProjectConceptMasterUuid(fsSummary.getProjectConceptMasterUuid());
            return fsSummaryDTO;
        }

        return null;
    }

    @Override
    public FsSummaryDTO getFsSummaryByProjectConceptId(Long pcId) {
        FsSummaryDTO fsSummaryDTO = new FsSummaryDTO();

        FsSummary fsSummary = fsSummaryRepository.findAllByProjectConceptMasterIdAndIsDeleted(pcId, false);
        if(fsSummary != null){
            fsSummaryDTO.setTitle_en(fsSummary.getTitle_en());
            fsSummaryDTO.setTitle_bn(fsSummary.getTitle_bn());
            fsSummaryDTO.setSponsoringMinistry(fsSummary.getSponsoringMinistry());
            fsSummaryDTO.setExecutingAgency(fsSummary.getExecutingAgency());
            fsSummaryDTO.setProject_objectives(fsSummary.getProject_objectives());
            fsSummaryDTO.setEstimated_proj_cost(fsSummary.getEstimated_proj_cost());
            fsSummaryDTO.setSector_id(fsSummary.getSector_id());
            fsSummaryDTO.setSub_sector_id(fsSummary.getSub_sector_id());
            fsSummaryDTO.setProject_category_id(fsSummary.getProject_category_id());
            fsSummaryDTO.setDate_of_commencement(fsSummary.getDate_of_commencement());
            fsSummaryDTO.setDate_of_completion(fsSummary.getDate_of_completion());
            fsSummaryDTO.setUuid(fsSummary.getUuid());
            fsSummaryDTO.setId(fsSummary.getId());
            fsSummaryDTO.setProjectConceptMasterId(fsSummary.getProjectConceptMasterId());
            fsSummaryDTO.setParipatraVersionId(fsSummary.getParipatraVersionId());
            fsSummaryDTO.setProjectConceptMasterUuid(fsSummary.getProjectConceptMasterUuid());
            return fsSummaryDTO;
        }

        return null;
    }

    @Override
    public ResponseWithResults getFsReportListWhichNotLinkWithDpp() {
        List<FsSummary> fsSummaryList = fsSummaryRepository.findAllByDppMasterIdIsNull();
        return new ResponseWithResults(200, "Data Found", fsSummaryList);
    }

    @Override
    public ResponseWithResults getFsReportList(String projectConceptMasterUuid) {
        List<FsSummary> fsSummaryList = fsSummaryRepository.findAllByDppMasterIdIsNullOrProjectConceptMasterUuid(projectConceptMasterUuid);
        return new ResponseWithResults(200, "Data Found", fsSummaryList);
    }

    @Override
    public ResponseStatus linkFsWithDpp(FsLinkWithDto fsLinkWithDto) {

        Optional<FsSummary> fsSummaryOpt = fsSummaryRepository.findByDppMasterId(fsLinkWithDto.getDppMasterId());
        if (fsSummaryOpt.isPresent()){
            FsSummary fsSummary = fsSummaryOpt.get();
            fsSummary.setDppMasterId(null);
            fsSummaryRepository.save(fsSummary);
        }
        Optional<FsSummary> fsSummaryOptional = fsSummaryRepository.findByProjectConceptMasterUuidAndIsDeleted(fsLinkWithDto.getFsUuid(), false);
        if(fsSummaryOptional.isPresent()) {
            FsSummary fsSummary = fsSummaryOptional.get();
            fsSummary.setDppMasterId(fsLinkWithDto.getDppMasterId());
            fsSummaryRepository.save(fsSummary);
            return new ResponseStatus(200, "Data Found");
        } else {
            return new ResponseStatus(404, "Data Not Found");
        }

    }

}
