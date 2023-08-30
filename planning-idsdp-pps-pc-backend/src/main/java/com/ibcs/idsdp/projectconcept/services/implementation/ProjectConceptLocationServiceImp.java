package com.ibcs.idsdp.projectconcept.services.implementation;


import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.projectconcept.client.ConfigurationClientService;
import com.ibcs.idsdp.projectconcept.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.projectconcept.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.projectconcept.model.domain.ProjectConceptLocation;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptLocationRepository;
import com.ibcs.idsdp.projectconcept.model.repositories.ProjectConceptMasterRepository;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptLocationService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptLocationDTO;
import com.ibcs.idsdp.projectconcept.web.dto.response.ProjectConceptLocationResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProjectConceptLocationServiceImp extends BaseService<ProjectConceptLocation, ProjectConceptLocationDTO> implements ProjectConceptLocationService {

    private final ProjectConceptLocationRepository repository;
    private final ProjectConceptMasterRepository projectConceptMasterRepository;
    private final ConfigurationClientService configurationClientService;

    public ProjectConceptLocationServiceImp(ProjectConceptLocationRepository repository, ProjectConceptMasterRepository projectConceptMasterRepository, ConfigurationClientService configurationClientService) {
        super(repository);
        this.repository = repository;
        this.projectConceptMasterRepository = projectConceptMasterRepository;
        this.configurationClientService = configurationClientService;
    }

    /**
     * Covert data for create
     *
     * @param projectLocationDTO
     * @return
     */
    @Override
    protected ProjectConceptLocation convertForCreate(ProjectConceptLocationDTO projectLocationDTO) {
        if (repository.existsByProjectConceptMasterIdAndIsDeleted(projectLocationDTO.getProjectConceptMasterId(), false))
            throw new ServiceExceptionHolder.InvalidRequestException("Already exist with this project summary id");
        ProjectConceptLocation projectLocation = super.convertForCreate(projectLocationDTO);
        projectLocation.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectLocationDTO.getProjectConceptMasterId(), false).get());
        return projectLocation;
    }

    /**
     * Convert data for update
     *
     * @param projectLocationDTO
     * @param projectLocation
     */
    @Override
    protected void convertForUpdate(ProjectConceptLocationDTO projectLocationDTO, ProjectConceptLocation projectLocation) {
        projectLocation.setProjectConceptMaster(projectConceptMasterRepository.findByIdAndIsDeleted(projectLocationDTO.getProjectConceptMasterId(), false).get());
        projectLocation.setDivision(projectLocationDTO.getDivision().toArray(new Long[projectLocationDTO.getDivision().size()]));
        projectLocation.setZilla(projectLocationDTO.getZilla().toArray(new Long[projectLocationDTO.getZilla().size()]));
        projectLocation.setUpazila(projectLocationDTO.getUpazila().toArray(new Long[projectLocationDTO.getUpazila().size()]));
        projectLocation.setMunicipality(projectLocationDTO.getMunicipality().toArray(new Long[projectLocationDTO.getMunicipality().size()]));
    }

    /**
     * Getting by project summary id
     *
     * @param projectSummaryId
     * @return
     */
    @Override
    public ProjectConceptLocationResponse getByProjectSummaryId(Long projectSummaryId) {
        ProjectConceptLocationResponse response = new ProjectConceptLocationResponse();
        if (!repository.existsByProjectConceptMasterIdAndIsDeleted(projectSummaryId, false))
            return null;
        ProjectConceptLocationDTO projectLocation = convertForRead(repository.findByProjectConceptMasterIdAndIsDeleted(projectSummaryId, false));

        DivisionZillaUpazilaMunicipalityResponse allDJUM = configurationClientService.getAllActiveDivisionZillaUpazillaMunicipality();

        List<UpaZillaRequest> selectedUpazilaList = setUpazila(projectLocation, allDJUM);
        List<ZillaRequest> selectedZillaList = setZilla(projectLocation, allDJUM);
        List<DivisionRequest> selectedDivisionList = setDivision(projectLocation, allDJUM);
        List<MunicipalityRequest> selectedMunicipalityList = projectLocation.getMunicipality().stream()
                .map(m -> allDJUM.getMunicipalitys().stream().filter(f -> f.getId().equals(m)).findFirst().get()).collect(Collectors.toList());

        response.setId(projectLocation.getId());
        response.setProjectConceptMasterId(projectLocation.getProjectConceptMasterId());
        response.setUuid(projectLocation.getUuid());
        response.setDivisions(selectedDivisionList);
        response.setZillas(selectedZillaList);
        response.setUpazilas(selectedUpazilaList);
        response.setMunicipalitys(selectedMunicipalityList);

        return response;
    }

    /**
     * Set Division
     * @param projectLocation
     * @param allDJUM
     * @return
     */
    private List<DivisionRequest> setDivision(ProjectConceptLocationDTO projectLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
        List<DivisionRequest> selectedDivisionList = new ArrayList<>();
        projectLocation.getDivision().forEach(d -> {
            DivisionRequest division = allDJUM.getDivisions().stream().filter(f -> f.getId().equals(d)).findFirst().get();
            division.setZillaList(allDJUM.getZillas().stream().filter(f -> f.getDivision().getId().equals(d)).peek(z -> {
                z.setChecked(projectLocation.getZilla().stream().anyMatch(a -> a.equals(z.getId())));
                z.setUpaZillaList(allDJUM.getUpazilas().stream().filter(fil -> fil.getZilla().getId().equals(z.getId())).peek(u -> {
                    u.setChecked(projectLocation.getUpazila().stream().anyMatch(a -> a.equals(u.getId())));
                    u.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(u.getId()))
                            .peek(m -> m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
                }).collect(Collectors.toList()));
            }).collect(Collectors.toList()));
            division.setChecked(false);
            selectedDivisionList.add(division);
        });
        return selectedDivisionList;
    }

    /**
     * Set Zilla
     * @param projectLocation
     * @param allDJUM
     * @return
     */
    private List<ZillaRequest> setZilla(ProjectConceptLocationDTO projectLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
        List<ZillaRequest> selectedZillaList = new ArrayList<>();
        projectLocation.getZilla().forEach(z -> {
            ZillaRequest zilla = allDJUM.getZillas().stream().filter(f -> f.getId().equals(z)).findFirst().get();
            zilla.setUpaZillaList(allDJUM.getUpazilas().stream().filter(f -> f.getZilla().getId().equals(z)).peek(u -> {
                u.setChecked(projectLocation.getUpazila().stream().anyMatch(a -> a.equals(u.getId())));
                u.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(u.getId()))
                        .peek(m -> m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
            }).collect(Collectors.toList()));
            zilla.setChecked(false);
            selectedZillaList.add(zilla);
        });
        return selectedZillaList;
    }


    /**
     * Set Upazilla
     * @param projectLocation
     * @param allDJUM
     * @return
     */
    private List<UpaZillaRequest> setUpazila(ProjectConceptLocationDTO projectLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
        List<UpaZillaRequest> selectedUpazilaList = new ArrayList<>();
        projectLocation.getUpazila().forEach(u -> {
            UpaZillaRequest upaZilla = allDJUM.getUpazilas().stream().filter(f -> f.getId().equals(u)).findFirst().get();
            upaZilla.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(u))
                    .peek(m -> m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
            upaZilla.setChecked(false);
            selectedUpazilaList.add(upaZilla);
        });
        return selectedUpazilaList;
    }


//    /**
//     * Set child data
//     * @param projectLocation
//     * @param selectedDivisionList
//     * @param selectedZillaList
//     * @param selectedUpazilaList
//     */
//    private void setAllSelectedDataChild(ProjectLocationDTO projectLocation, List<DivisionRequest> selectedDivisionList, List<ZillaRequest> selectedZillaList, List<UpaZillaRequest> selectedUpazilaList, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
//
//        selectedZillaList.forEach(e -> {
//            e.setUpaZillaList(selectedDivisionList.stream().filter(f -> f.getId().equals(e.getDivision().getId())).findFirst().get()
//                    .getZillaList().stream().filter(f -> f.getId().equals(e.getId())).findFirst().get().getUpaZillaList());
//            e.setChecked(false);
//        });
//
//        selectedUpazilaList.forEach(e -> {
//            e.setMunicipalityList(selectedZillaList.stream().filter(f -> f.getId().equals(e.getZilla().getId())).findFirst().get()
//                    .getUpaZillaList().stream().filter(f -> f.getId().equals(e.getId())).findFirst().get().getMunicipalityList());
//            e.setChecked(false);
//        });
//    }


}


