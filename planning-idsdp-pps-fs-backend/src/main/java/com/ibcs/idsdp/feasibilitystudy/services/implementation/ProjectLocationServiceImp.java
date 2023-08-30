package com.ibcs.idsdp.feasibilitystudy.services.implementation;

import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.feasibilitystudy.client.ConfigurationClientService;
import com.ibcs.idsdp.feasibilitystudy.client.ProjectConceptClientService;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.feasibilitystudy.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.feasibilitystudy.model.domain.ProjectLocation;
import com.ibcs.idsdp.feasibilitystudy.model.repositories.ProjectLocationRepository;
import com.ibcs.idsdp.feasibilitystudy.services.ProjectLocationService;
import com.ibcs.idsdp.feasibilitystudy.web.dto.ProjectLocationDTO;
import com.ibcs.idsdp.feasibilitystudy.web.dto.response.ProjectLocationResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
public class ProjectLocationServiceImp extends BaseService<ProjectLocation, ProjectLocationDTO> implements ProjectLocationService {

    private final ProjectLocationRepository repository;
    private final ConfigurationClientService configurationClientService;
    private final ProjectConceptClientService projectConceptClientService;

    public ProjectLocationServiceImp(ProjectLocationRepository repository, ConfigurationClientService configurationClientService, ProjectConceptClientService projectConceptClientService) {
        super(repository);
        this.repository = repository;
        this.configurationClientService = configurationClientService;
        this.projectConceptClientService = projectConceptClientService;
    }


    /**
     * Covert data for create
     *
     * @param projectLocationDTO
     * @return
     */
    @Override
    protected ProjectLocation convertForCreate(ProjectLocationDTO projectLocationDTO) {
        if (repository.existsByFsrMasterIdAndIsDeleted(projectLocationDTO.getFsrMasterId(), false))
            throw new ServiceExceptionHolder.InvalidRequestException("Already exist with this feasibility summary id");
        ProjectLocation projectLocation = super.convertForCreate(projectLocationDTO);
        return projectLocation;
    }

    /**
     * For update project location
     *
     * @param projectLocationDTO
     * @param projectLocation
     */
    @Override
    protected void convertForUpdate(ProjectLocationDTO projectLocationDTO, ProjectLocation projectLocation) {
//        projectLocation.setProjectConceptId(projectLocationDTO.getProjectConceptId());
        projectLocation.setDivision(projectLocationDTO.getDivision().toArray(new Long[projectLocationDTO.getDivision().size()]));
        projectLocation.setZilla(projectLocationDTO.getZilla().toArray(new Long[projectLocationDTO.getZilla().size()]));
        projectLocation.setUpazila(projectLocationDTO.getUpazila().toArray(new Long[projectLocationDTO.getUpazila().size()]));
        projectLocation.setMunicipality(projectLocationDTO.getMunicipality().toArray(new Long[projectLocationDTO.getMunicipality().size()]));
    }

    /**
     * For get project location
     *
     * @param fsrMasterId
     */
    @Override
    public ProjectLocationResponse getByProjectConceptId(Long fsrMasterId, Long pcMasterId) {
        ProjectLocationResponse response = new ProjectLocationResponse();
        System.out.println("f = " + fsrMasterId);
        System.out.println("p = " + pcMasterId);
        if (repository.existsByFsrMasterIdAndIsDeleted(fsrMasterId, false)) {
            ProjectLocationDTO projectLocation = convertForRead(repository.findByFsrMasterIdAndIsDeleted(fsrMasterId, false));

            DivisionZillaUpazilaMunicipalityResponse allDJUM = configurationClientService.getAllActiveDivisionZillaUpazillaMunicipality();

            List<UpaZillaRequest> selectedUpazilaList = setUpazila(projectLocation, allDJUM);
            List<ZillaRequest> selectedZillaList = setZilla(projectLocation, allDJUM);
            List<DivisionRequest> selectedDivisionList = setDivision(projectLocation, allDJUM);
            List<MunicipalityRequest> selectedMunicipalityList = projectLocation.getMunicipality().stream()
                    .map(m -> allDJUM.getMunicipalitys().stream().filter(f -> f.getId().equals(m)).findFirst().get()).collect(Collectors.toList());

            response.setId(projectLocation.getId());
            response.setUuid(projectLocation.getUuid());
            response.setFsrMasterId(projectLocation.getFsrMasterId());
            response.setUuid(projectLocation.getUuid());
            response.setDivisions(selectedDivisionList);
            response.setZillas(selectedZillaList);
            response.setUpazilas(selectedUpazilaList);
            response.setMunicipalitys(selectedMunicipalityList);
            return response;
        } else {
            ProjectLocationResponse locationFromPc = projectConceptClientService.getByProjectSummaryId(pcMasterId);
            if (locationFromPc != null) {
                response.setFsrMasterId(fsrMasterId);
                response.setProjectConceptMasterId(pcMasterId);
                response.setDivisions(locationFromPc.getDivisions());
                response.setZillas(locationFromPc.getZillas());
                response.setUpazilas(locationFromPc.getUpazilas());
                response.setMunicipalitys(locationFromPc.getMunicipalitys());
                return response;
            }
        }
        return null;
    }

    /**
     * Set Division
     *
     * @param projectLocation
     * @param allDJUM
     * @return
     */
    private List<DivisionRequest> setDivision(ProjectLocationDTO projectLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
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
     *
     * @param projectLocation
     * @param allDJUM
     * @return
     */
    private List<ZillaRequest> setZilla(ProjectLocationDTO projectLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
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
     *
     * @param projectLocation
     * @param allDJUM
     * @return
     */
    private List<UpaZillaRequest> setUpazila(ProjectLocationDTO projectLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
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


}
