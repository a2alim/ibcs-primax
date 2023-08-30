package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.client.ConfigurationClientService;
import com.ibcs.idsdp.dpptapp.client.ProjectConceptClientService;
import com.ibcs.idsdp.dpptapp.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.MunicipalityRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.dpptapp.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.dpptapp.client.dto.response.DivisionZillaUpazilaMunicipalityResponse;
import com.ibcs.idsdp.dpptapp.client.dto.response.ProjectLocationResponse;
import com.ibcs.idsdp.dpptapp.model.domain.DppLocation;
import com.ibcs.idsdp.dpptapp.model.domain.DppLocationWiseBreakdown;
import com.ibcs.idsdp.dpptapp.model.repositories.DppLocationRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppLocationWiseBreakdownRepository;
import com.ibcs.idsdp.dpptapp.model.repositories.DppObjectiveCostRepository;
import com.ibcs.idsdp.dpptapp.web.dto.DppLocationDTO;
import com.ibcs.idsdp.dpptapp.web.dto.GisLocationDTO;
import com.ibcs.idsdp.dpptapp.web.dto.response.DppLocationResponse;
import com.ibcs.idsdp.dpptapp.web.dto.response.LocationAndCostResponse;
import lombok.extern.slf4j.Slf4j;
import org.modelmapper.ModelMapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Slf4j
@Service
public class DppLocationServiceImp extends BaseService<DppLocation, DppLocationDTO> implements DppLocationService {
    private final DppLocationRepository repository;
    private final ConfigurationClientService configurationClientService;
    private final DppObjectiveCostRepository dppObjectiveCostRepository;
    private final ProjectConceptClientService projectConceptClientService;
    private final DppLocationWiseBreakdownRepository dppLocationWiseBreakdownRepository;
    private final DppLocationWiseBreakdownServiceImpl dppLocationWiseBreakdownServiceImpl;
    private final GisLocationServiceImp gisLocationServiceImp;

    public DppLocationServiceImp(DppLocationRepository repository, ConfigurationClientService configurationClientService,
                                 DppObjectiveCostRepository dppObjectiveCostRepository, ProjectConceptClientService projectConceptClientService,
                                 DppLocationWiseBreakdownRepository dppLocationWiseBreakdownRepository,
                                 DppLocationWiseBreakdownServiceImpl dppLocationWiseBreakdownServiceImpl, GisLocationServiceImp gisLocationServiceImp) {
        super(repository);
        this.repository = repository;
        this.configurationClientService = configurationClientService;
        this.dppObjectiveCostRepository = dppObjectiveCostRepository;
        this.projectConceptClientService = projectConceptClientService;
        this.dppLocationWiseBreakdownRepository = dppLocationWiseBreakdownRepository;
        this.dppLocationWiseBreakdownServiceImpl = dppLocationWiseBreakdownServiceImpl;
        this.gisLocationServiceImp = gisLocationServiceImp;
    }

    /**
     * convertForCreate for using base method
     *
     * @param dppLocationDTO
     * @return
     */
    @Override
    protected DppLocation convertForCreate(DppLocationDTO dppLocationDTO) {
        if (repository.existsByProjectConceptMasterIdAndIsDeleted(dppLocationDTO.getProjectConceptMasterId(), false))
            throw new ServiceExceptionHolder.InvalidRequestException("Already exist with this project summary id");
        DppLocation dppLocation = super.convertForCreate(dppLocationDTO);
        dppLocation.setDppMaster(dppObjectiveCostRepository.findByProjectConceptMasterIdAndIsDeleted(dppLocationDTO.getProjectConceptMasterId(), false).get());
        gisLocationServiceImp.createList(generateGisLocation(dppLocationDTO));
        return dppLocation;
    }

    /**
     * convertForUpdate for using base method
     *
     * @param dppLocationDTO
     * @param dppLocation
     */
    @Override
    protected void convertForUpdate(DppLocationDTO dppLocationDTO, DppLocation dppLocation) {
        // dppLocation.setProjectSummary(projectSummaryRepository.findByIdAndIsDeleted(dppLocationDTO.getProjectSummaryId(), false).get());
        dppLocation.setDppMaster(dppObjectiveCostRepository.findByProjectConceptMasterIdAndIsDeleted(dppLocationDTO.getProjectConceptMasterId(), false).get());
//        dppLocation.setProjectConceptMasterId(dppLocationDTO.getProjectConceptMasterId());
        dppLocation.setDivision(dppLocationDTO.getDivision().toArray(new Long[dppLocationDTO.getDivision().size()]));
        dppLocation.setZilla(dppLocationDTO.getZilla().toArray(new Long[dppLocationDTO.getZilla().size()]));
        dppLocation.setUpazila(dppLocationDTO.getUpazila().toArray(new Long[dppLocationDTO.getUpazila().size()]));
        dppLocation.setMunicipality(dppLocationDTO.getMunicipality().toArray(new Long[dppLocationDTO.getMunicipality().size()]));
        dppLocation.setProjectAreaJustification(dppLocationDTO.getProjectAreaJustification());
        deleteRemovedUpazilaFromLocationWiseCost(dppLocationDTO, dppLocation);
        //TODO: Commit for GIS data
        //gisLocationServiceImp.updateList(dppLocationDTO.getDppMasterId(), "DPP", generateGisLocation(dppLocationDTO));
    }

    private List<GisLocationDTO> generateGisLocation(DppLocationDTO location) {
        List<GisLocationDTO> list = new ArrayList<>();
        List<DivisionRequest> divisionList = configurationClientService.getDivisionByIdSet(new IdSetRequestBodyDTO() {{ setIds(location.getDivision()); }});
        List<ZillaRequest> zillaList = configurationClientService.getZillaByIdSet(new IdSetRequestBodyDTO() {{ setIds(location.getZilla()); }});
        List<UpaZillaRequest> upazilaList = configurationClientService.getUpazillaByIdSet(new IdSetRequestBodyDTO() {{ setIds(location.getUpazila()); }});

        for (UpaZillaRequest upazila : upazilaList) {
            String upazilaCode = upazila.getGeoCode();
            String zillaCode = upazila.getZilla().getGeoCode();
            String divisionCode = upazila.getZilla().getDivision().getGeoCode();
            list.add(addGisLocationDto(location.getProjectConceptMasterId(), location.getDppMasterId(), divisionCode, zillaCode, upazilaCode));
        }

        for (ZillaRequest zilla : zillaList) {
            Optional<GisLocationDTO> zil = list.stream().filter(p -> p.getZillaGeoCode().equals(zilla.getGeoCode())).findFirst();
            if (zil.isEmpty()) {
                list.add(addGisLocationDto(location.getProjectConceptMasterId(), location.getDppMasterId(), zilla.getDivision().getGeoCode(), zilla.getGeoCode(), ""));
            }
        }

        for (DivisionRequest division : divisionList) {
            Optional<GisLocationDTO> div = list.stream().filter(p -> p.getDivisionGeoCode().equals(division.getGeoCode())).findFirst();
            if (div.isEmpty()) {
                list.add(addGisLocationDto(location.getProjectConceptMasterId(), location.getDppMasterId(), division.getGeoCode(), "", ""));
            }
        }

        return list;
    }

    private GisLocationDTO addGisLocationDto(Long pcId, Long dppId, String divisionGeoCode, String zillaGeoCode, String upazilaGeoCode) {
        GisLocationDTO locationDTO = new GisLocationDTO();
        locationDTO.setSourceModuleId(dppId);
        locationDTO.setSourceModuleType("DPP");
        locationDTO.setProjectConceptMasterId(pcId);
        locationDTO.setDivisionGeoCode(divisionGeoCode);
        locationDTO.setZillaGeoCode(zillaGeoCode);
        locationDTO.setUpazilaGeoCode(upazilaGeoCode);
        return locationDTO;
    }

    private void deleteRemovedUpazilaFromLocationWiseCost(DppLocationDTO dppLocationDTO, DppLocation dppLocation) {
        List<DppLocationWiseBreakdown> locationWiseBreakdowns = dppLocationWiseBreakdownRepository
                .findAllByDppObjectiveCostIdAndIsDeleted(dppLocation.getDppMaster().getId(), false);

        if (!locationWiseBreakdowns.isEmpty()) {
            locationWiseBreakdowns.forEach(e -> {
                if (dppLocationDTO.getUpazila().stream().noneMatch(nm -> nm.equals(e.getUpazilaId()))){
                    dppLocationWiseBreakdownServiceImpl.delete(e.getUuid());
                }
            });
        }
    }

    /**
     * Get By Objective Cost Id
     *
     * @param objectiveCostId
     * @return
     */
    @Override
    public DppLocationResponse getByObjectiveCostId(Long objectiveCostId) {
        DppLocationResponse response = new DppLocationResponse();
        DppLocationDTO dppLocationDTO = convertForRead(repository.findByIsDeleted(false));

        List<DivisionRequest> selectedDivisionList = configurationClientService.getDivisionByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(dppLocationDTO.getDivision());
                }}
        );
        List<ZillaRequest> selectedZillaList = configurationClientService.getZillaByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(dppLocationDTO.getZilla());
                }}
        );
        List<UpaZillaRequest> selectedUpazilaList = configurationClientService.getUpazillaByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(dppLocationDTO.getUpazila());
                }}
        );
        List<MunicipalityRequest> selectedMunicipalityList = configurationClientService.getMunicipalityByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(dppLocationDTO.getMunicipality());
                }}
        );

//        setAllSelectedDataChild(dppLocationDTO, selectedDivisionList, selectedZillaList, selectedUpazilaList, selectedMunicipalityList);

        response.setId(dppLocationDTO.getId());
        response.setUuid(dppLocationDTO.getUuid());
//        response.setDppMasterId(dppLocationDTO.getDppMasterId());
        response.setUuid(dppLocationDTO.getUuid());
        response.setDivisions(selectedDivisionList.stream().peek(m -> m.setChecked(false)).collect(Collectors.toList()));
        response.setZillas(selectedZillaList.stream().peek(m -> m.setChecked(false)).collect(Collectors.toList()));
        response.setUpazilas(selectedUpazilaList.stream().peek(m -> m.setChecked(false)).collect(Collectors.toList()));
        response.setMunicipalitys(selectedMunicipalityList);

        return response;
    }

    /**
     * Get By Project Summary Id
     *
     * @param projectSummaryId
     * @return
     */
    @Override
    public DppLocationResponse getByProjectSummaryId(Long projectSummaryId) {
        DppLocationResponse response = new DppLocationResponse();

        DppLocation dppLocation = repository.findByProjectConceptMasterIdAndIsDeleted(projectSummaryId, false);
        DppLocationDTO dppLocationDTO;
        if (dppLocation != null) {
            dppLocationDTO = convertForRead(dppLocation);
            DivisionZillaUpazilaMunicipalityResponse allDJUM = configurationClientService.getAllActiveDivisionZillaUpazillaMunicipality();

            List<UpaZillaRequest> selectedUpazilaList = setUpazila(dppLocationDTO, allDJUM);
            List<ZillaRequest> selectedZillaList = setZilla(dppLocationDTO, allDJUM);
            List<DivisionRequest> selectedDivisionList = setDivision(dppLocationDTO, allDJUM);
            List<MunicipalityRequest> selectedMunicipalityList = dppLocationDTO.getMunicipality().stream()
                    .map(m -> allDJUM.getMunicipalitys().stream().filter(f -> f.getId().equals(m)).findFirst().get()).collect(Collectors.toList());

            response.setId(dppLocationDTO.getId());
            response.setProjectConceptMasterId(dppLocationDTO.getProjectConceptMasterId());
            response.setUuid(dppLocationDTO.getUuid());
            response.setDppMasterId(dppLocationDTO.getDppMasterId());
            response.setDivisions(selectedDivisionList);
            response.setZillas(selectedZillaList);
            response.setUpazilas(selectedUpazilaList);
            response.setMunicipalitys(selectedMunicipalityList);
            response.setProjectAreaJustification(dppLocation.getProjectAreaJustification());
        } else {
            ProjectLocationResponse projectLocationResponse = projectConceptClientService.getByProjectSummaryId(projectSummaryId);
            System.out.println(projectLocationResponse);
            if (projectLocationResponse == null || projectLocationResponse.getDivisions() == null || projectLocationResponse.getDivisions().isEmpty())
                return null;

            DppLocationResponse projectLocation = new ModelMapper().map(projectLocationResponse, DppLocationResponse.class);
            response.setProjectConceptMasterId(projectLocation.getId());
            response.setDivisions(projectLocation.getDivisions());
            response.setZillas(projectLocation.getZillas());
            response.setUpazilas(projectLocation.getUpazilas());
            response.setMunicipalitys(projectLocation.getMunicipalitys());
            response.setProjectAreaJustification("");
        }
        return response;
    }

    /**
     * Set Division
     * @param dppLocation
     * @param allDJUM
     * @return
     */
    private List<DivisionRequest> setDivision(DppLocationDTO dppLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
        List<DivisionRequest> selectedDivisionList = new ArrayList<>();
        dppLocation.getDivision().forEach(d -> {
            DivisionRequest division = allDJUM.getDivisions().stream().filter(f -> f.getId().equals(d)).findFirst().get();
            division.setZillaList(allDJUM.getZillas().stream().filter(f -> f.getDivision().getId().equals(d)).peek(z -> {
                z.setChecked(dppLocation.getZilla().stream().anyMatch(a -> a.equals(z.getId())));
                z.setUpaZillaList(allDJUM.getUpazilas().stream().filter(fil -> fil.getZilla().getId().equals(z.getId())).peek(u -> {
                    u.setChecked(dppLocation.getUpazila().stream().anyMatch(a -> a.equals(u.getId())));
                    u.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(u.getId()))
                            .peek(m -> m.setChecked(dppLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
                }).collect(Collectors.toList()));
            }).collect(Collectors.toList()));
            division.setChecked(false);
            selectedDivisionList.add(division);
        });
        return selectedDivisionList;
    }

    /**
     * Set Zilla
     * @param dppLocation
     * @param allDJUM
     * @return
     */
    private List<ZillaRequest> setZilla(DppLocationDTO dppLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
        List<ZillaRequest> selectedZillaList = new ArrayList<>();
        dppLocation.getZilla().forEach(z -> {
            ZillaRequest zilla = allDJUM.getZillas().stream().filter(f -> f.getId().equals(z)).findFirst().get();
            zilla.setUpaZillaList(allDJUM.getUpazilas().stream().filter(f -> f.getZilla().getId().equals(z)).peek(u -> {
                u.setChecked(dppLocation.getUpazila().stream().anyMatch(a -> a.equals(u.getId())));
                u.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(u.getId()))
                        .peek(m -> m.setChecked(dppLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
            }).collect(Collectors.toList()));
            zilla.setChecked(false);
            selectedZillaList.add(zilla);
        });
        return selectedZillaList;
    }


    /**
     * Set Upazilla
     * @param dppLocation
     * @param allDJUM
     * @return
     */
    private List<UpaZillaRequest> setUpazila(DppLocationDTO dppLocation, DivisionZillaUpazilaMunicipalityResponse allDJUM) {
        List<UpaZillaRequest> selectedUpazilaList = new ArrayList<>();
        dppLocation.getUpazila().forEach(u -> {
            UpaZillaRequest upaZilla = allDJUM.getUpazilas().stream().filter(f -> f.getId().equals(u)).findFirst().get();
            upaZilla.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(u))
                    .peek(m -> m.setChecked(dppLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
            upaZilla.setChecked(false);
            selectedUpazilaList.add(upaZilla);
        });
        return selectedUpazilaList;
    }


    /**
     * Set child data
     * @param projectLocation
     * @param selectedDivisionList
     * @param selectedZillaList
     * @param selectedUpazilaList
     */
    private void setAllSelectedDataChild(DppLocationDTO projectLocation, List<DivisionRequest> selectedDivisionList, List<ZillaRequest> selectedZillaList, List<UpaZillaRequest> selectedUpazilaList,
                                         DivisionZillaUpazilaMunicipalityResponse allDJUM) {
//        List<MunicipalityRequest> municipalityList = configurationClientService.getByUpaZillaIdSet(new IdSetRequestBodyDTO() {{
//            setIds(selectedUpazilaList.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet()));
//        }});
//        List<MunicipalityRequest> municipalityList = configurationClientService.getAllMunicipality();

        selectedUpazilaList.forEach(e -> {
//            e.setChecked(false);
            e.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(e.getId()))
                    .peek(m -> m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
        });

//        List<UpaZillaRequest> upazilaList = configurationClientService.getByZillaIdSet(new IdSetRequestBodyDTO() {{
//            setIds(selectedZillaList.stream().map(ZillaRequest::getId).collect(Collectors.toSet()));
//        }});

//        List<UpaZillaRequest> upazilaList = configurationClientService.getAllUpazila();
        selectedZillaList.forEach(e -> {
//            e.setChecked(false);
            e.setUpaZillaList(allDJUM.getUpazilas().stream().filter(f -> f.getZilla().getId().equals(e.getId())).peek(u -> {
                u.setChecked(projectLocation.getUpazila().stream().anyMatch(a -> a.equals(u.getId())));
                u.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(e.getId()))
                        .peek(m -> m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
            }).collect(Collectors.toList()));
        });


//        List<ZillaRequest> zillaList = configurationClientService.getByDivisionIdSet(new IdSetRequestBodyDTO() {{
//            setIds(selectedDivisionList.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet()));
//        }});
//        List<ZillaRequest> zillaList = configurationClientService.getAllZilla();
        selectedDivisionList.forEach(e -> {
//            e.setChecked(false);
            e.setZillaList(allDJUM.getZillas().stream().filter(f -> f.getDivision().getId().equals(e.getId())).peek(z -> {
                z.setChecked(projectLocation.getZilla().stream().anyMatch(a -> a.equals(z.getId())));
//                z.setUpaZillaList(selectedUpazilaList.stream().filter(fil -> fil.getZilla().getId().equals(z.getId())).collect(Collectors.toList()));
                z.setUpaZillaList(allDJUM.getUpazilas().stream().filter(fil -> fil.getZilla().getId().equals(z.getId())).peek(u -> {
                    u.setChecked(projectLocation.getUpazila().stream().anyMatch(a -> a.equals(u.getId())));
                    u.setMunicipalityList(allDJUM.getMunicipalitys().stream().filter(f -> f.getUpaZilla().getId().equals(e.getId()))
                            .peek(m -> m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())))).collect(Collectors.toList()));
                }).collect(Collectors.toList()));
            }).collect(Collectors.toList()));
        });
    }

    /*
     *//**
     * Set Child data
     * @param projectLocation
     * @param selectedDivisionList
     * @param selectedZillaList
     * @param selectedUpazilaList
     *//*
    private void setAllSectedDataChildFromDppLocation(DppLocationDTO projectLocation, List<DivisionRequest> selectedDivisionList, List<ZillaRequest> selectedZillaList, List<UpaZillaRequest> selectedUpazilaList, List<MunicipalityRequest> selectedMunicipalityList) {
        List<MunicipalityRequest> municipalityList = configurationClientService.getByUpaZillaIdSet(new IdSetRequestBodyDTO() {{
            setIds(selectedUpazilaList.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet()));
        }});

        selectedUpazilaList.forEach(e -> {
            e.setChecked(false);
            e.setMunicipalityList(municipalityList.stream().filter(f -> f.getUpaZilla().getId().equals(e.getId())).map(m -> {
                m.setChecked(projectLocation.getMunicipality().stream().anyMatch(a -> a.equals(m.getId())));
                return m;
            }).collect(Collectors.toList()));
        });

        List<UpaZillaRequest> upazilaList = configurationClientService.getByZillaIdSet(new IdSetRequestBodyDTO() {{
            setIds(selectedZillaList.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet()));
        }});
        selectedZillaList.forEach(e -> {
            e.setChecked(false);
            e.setUpaZillaList(upazilaList.stream().filter(f -> f.getZilla().getId().equals(e.getId())).map(m -> {
                m.setChecked(projectLocation.getUpazila().stream().anyMatch(a -> a.equals(m.getId())));
                m.setMunicipalityList(selectedMunicipalityList.stream().filter(fil -> fil.getUpaZilla().getId().equals(m.getId())).collect(Collectors.toList()));
                return m;
            }).collect(Collectors.toList()));
        });


        List<ZillaRequest> zillaList = configurationClientService.getByDivisionIdSet(new IdSetRequestBodyDTO() {{
            setIds(selectedDivisionList.stream().map(UuidIdHolderRequestBodyDTO::getId).collect(Collectors.toSet()));
        }});
        selectedDivisionList.forEach(e -> {
            e.setChecked(false);
            e.setZillaList(zillaList.stream().filter(f -> f.getDivision().getId().equals(e.getId())).map(m -> {
                m.setChecked(projectLocation.getZilla().stream().anyMatch(a -> a.equals(m.getId())));
                m.setUpaZillaList(selectedUpazilaList.stream().filter(fil -> fil.getZilla().getId().equals(m.getId())).collect(Collectors.toList()));
                return m;
            }).collect(Collectors.toList()));
        });
    }*/

    /**
     * Get Location By Objective Cost Id
     *
     * @param projectSummaryId
     * @return
     */
    @Override
    public LocationAndCostResponse getLocationByObjectiveCostIdUsingProjectSummary(Long projectSummaryId) {
        DppLocation dppLocation = repository.findByProjectConceptMasterIdAndIsDeleted(projectSummaryId, false);
        if (dppLocation == null)
            return null;
        DppLocationDTO location = convertForRead(repository.findByDppMasterIdAndIsDeleted(dppLocation.getDppMaster().getId(), false));

        List<DivisionRequest> selectedDivisionList = configurationClientService.getDivisionByIdSet(
                new IdSetRequestBodyDTO() {{
                    setIds(location.getDivision());
                }}
        );

        List<ZillaRequest> selectedZillaList = new ArrayList<>();
        if (!location.getZilla().isEmpty()) {
            selectedZillaList = configurationClientService.getZillaByIdSet(
                    new IdSetRequestBodyDTO() {{
                        setIds(location.getZilla());
                    }}
            );
        }

        List<UpaZillaRequest> selectedUpazilaList = new ArrayList<>();
        if (!location.getUpazila().isEmpty()) {
            selectedUpazilaList = configurationClientService.getUpazillaByIdSet(
                    new IdSetRequestBodyDTO() {{
                        setIds(location.getUpazila());
                    }}
            );
        }

        arrangrResponseData(selectedDivisionList, selectedZillaList, selectedUpazilaList);

        LocationAndCostResponse response = new LocationAndCostResponse();
        response.setDivisions(selectedDivisionList);
        response.setDppMasterId(dppLocation.getDppMaster().getId());
        response.setId(location.getId());
        response.setUuid(location.getUuid());
        return response;
    }

    /**
     * @param selectedDivisionList
     * @param selectedZillaList
     * @param selectedUpazilaList
     */
    private void arrangrResponseData(List<DivisionRequest> selectedDivisionList, List<ZillaRequest> selectedZillaList, List<UpaZillaRequest> selectedUpazilaList) {
//        List<ZillaRequest> finalSelectedZillaList = selectedZillaList;
//        List<UpaZillaRequest> finalSelectedUpazilaList = selectedUpazilaList;
        selectedDivisionList.forEach(d -> {
            List<ZillaRequest> zillas = selectedZillaList.stream()
                    .filter(f -> f.getDivision().getId().equals(d.getId()))
                    .collect(Collectors.toList());
            zillas.forEach(z -> {
                List<UpaZillaRequest> upazillas = selectedUpazilaList.stream()
                        .filter(f -> f.getZilla().getId().equals(z.getId()))
                        .collect(Collectors.toList());
                z.setUpaZillaList(upazillas);
            });
            d.setZillaList(zillas);
        });
    }


    public DppLocationDTO getLocationByDppMasterId(Long dppMasterId) {
        return convertForRead(repository.findByDppMasterIdAndIsDeleted(dppMasterId, false));
    }
}


