package com.ibcs.idsdp.projectconcept.services.implementation;

import com.ibcs.idsdp.projectconcept.client.ConfigurationClientService;
import com.ibcs.idsdp.projectconcept.client.DppClientService;
import com.ibcs.idsdp.projectconcept.client.dto.request.DivisionRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.UpaZillaRequest;
import com.ibcs.idsdp.projectconcept.client.dto.request.ZillaRequest;
import com.ibcs.idsdp.projectconcept.enums.SourceEnum;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptMasterService;
import com.ibcs.idsdp.projectconcept.services.ProjectInfoService;
import com.ibcs.idsdp.projectconcept.web.dto.ProjectConceptMasterDTO;
import com.ibcs.idsdp.projectconcept.web.dto.gisDTO.GisProjectCountRequestDTO;
import com.ibcs.idsdp.projectconcept.web.dto.gisDTO.GisProjectCountResponseDTO;
import com.ibcs.idsdp.projectconcept.web.dto.location.DppLocationResponse;
import com.ibcs.idsdp.projectconcept.web.dto.request.PsFsListSearchRequest;
import lombok.AllArgsConstructor;
import org.apache.commons.lang.StringUtils;
import org.springframework.beans.BeanUtils;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;


@Service
@AllArgsConstructor
@Transactional
public class ProjectInfoServiceImpl implements ProjectInfoService {
    private final ConfigurationClientService configService;
    private final ProjectConceptMasterService pcService;
    private final DppClientService dppClientService;

    @Override
    public List<GisProjectCountResponseDTO> getProjectCountByDivisionAndZilla(GisProjectCountRequestDTO requestDTO) {
        List<GisProjectCountResponseDTO> result = new ArrayList<>();
        List<ProjectConceptMasterDTO> list = getProjectList(requestDTO);
        if (StringUtils.isNotEmpty(requestDTO.getUpazillaGeoCode()) && requestDTO.getUpazillaGeoCode().equals("all")) {
            List<UpaZillaRequest> upazillaList = configService.getAllUpazila();
            for (UpaZillaRequest upaZilla : upazillaList) {
                GisProjectCountResponseDTO dto = new GisProjectCountResponseDTO();
                BeanUtils.copyProperties(upaZilla, dto);
                getUpazillaCount(upaZilla.getId(), list, dto);
                result.add(dto);
            }
        } else if (StringUtils.isNotEmpty(requestDTO.getZillaGeoCode())) {
            if (requestDTO.getZillaGeoCode().equals("all")) {
                List<ZillaRequest> zillaList = configService.getAllZilla();
                for (ZillaRequest zilla : zillaList) {
                    GisProjectCountResponseDTO dto = new GisProjectCountResponseDTO();
                    BeanUtils.copyProperties(zilla, dto);
                    getZillaCount(zilla.getId(), list, dto);
                    result.add(dto);
                }
            } else {
                List<UpaZillaRequest> upazillaList = configService.getUpazillaByZillaGeoCode(requestDTO.getZillaGeoCode());
                for (UpaZillaRequest upaZilla : upazillaList) {
                    GisProjectCountResponseDTO dto = new GisProjectCountResponseDTO();
                    BeanUtils.copyProperties(upaZilla, dto);
                    getUpazillaCount(upaZilla.getId(), list, dto);
                    result.add(dto);
                }
            }
        } else if (StringUtils.isNotEmpty(requestDTO.getDivisionGeoCode())) {
            if (requestDTO.getDivisionGeoCode().equals("all")) {
                List<DivisionRequest> divisionList = configService.getAllDivision();
                for (DivisionRequest division : divisionList) {
                    GisProjectCountResponseDTO dto = new GisProjectCountResponseDTO();
                    BeanUtils.copyProperties(division, dto);
                    getDivisionCount(division.getId(), list, dto);
                    result.add(dto);
                }
            } else {
                List<ZillaRequest> zillaList = configService.getZillaByDivisionGeoCode(requestDTO.getDivisionGeoCode());
                for (ZillaRequest zilla : zillaList) {
                    GisProjectCountResponseDTO dto = new GisProjectCountResponseDTO();
                    BeanUtils.copyProperties(zilla, dto);
                    getZillaCount(zilla.getId(), list, dto);
                    result.add(dto);
                }
            }
        }

        return result;
    }

    private List<ProjectConceptMasterDTO> getProjectList(GisProjectCountRequestDTO requestDTO) {
        List<ProjectConceptMasterDTO> result = new ArrayList<>();
        PsFsListSearchRequest searchRequest = new PsFsListSearchRequest();
        searchRequest.setSource(SourceEnum.DPP);
        searchRequest.setGob(false);
        searchRequest.setIsForeignAid(false);
        searchRequest.setIsFsRequired(false);
        searchRequest.setStartDate(requestDTO.getStartDate());
        searchRequest.setEndDate(requestDTO.getEndDate());
        searchRequest.setLowAmount(requestDTO.getLowAmount());
        searchRequest.setHighAmount(requestDTO.getHighAmount());
        Page<ProjectConceptMasterDTO> list = pcService.criteriaBasedSearch(searchRequest);
        for (ProjectConceptMasterDTO pcDTO : list) {
            if (pcDTO.getProjectTypeDTO().getNameEn().equals("DPP")) {
                DppLocationResponse location = dppClientService.getSelectedLocationByPcId(pcDTO.getId());
                if (location != null) {
                    pcDTO.setLocation(location);
                    result.add(pcDTO);
                }
            }
        }
        return result;
    }

    private GisProjectCountResponseDTO getDivisionCount(Long divisionId, List<ProjectConceptMasterDTO> list, GisProjectCountResponseDTO dto) {
        List<ProjectConceptMasterDTO> projectList = new ArrayList<>();
        for (ProjectConceptMasterDTO pcDTO : list) {
            if (pcDTO.getLocation() != null) {
                boolean contains = pcDTO.getLocation().getDivisions().stream().anyMatch(u -> Objects.equals(u.getId(), divisionId));
                if (contains) projectList.add(pcDTO);
            }
        }

        dto.setProjectCount(projectList.size());
        dto.setProjectList(projectList);
        return dto;
    }

    private GisProjectCountResponseDTO getZillaCount(Long zillaId, List<ProjectConceptMasterDTO> list, GisProjectCountResponseDTO dto) {
        List<ProjectConceptMasterDTO> projectList = new ArrayList<>();
        for (ProjectConceptMasterDTO pcDTO : list) {
            if (pcDTO.getLocation() != null) {
                boolean contains = pcDTO.getLocation().getZillas().stream().anyMatch(u -> Objects.equals(u.getId(), zillaId));
                if (contains) projectList.add(pcDTO);
            }
        }

        dto.setProjectCount(projectList.size());
        dto.setProjectList(projectList);
        return dto;
    }

    private GisProjectCountResponseDTO getUpazillaCount(Long upazillaId, List<ProjectConceptMasterDTO> list, GisProjectCountResponseDTO dto) {
        List<ProjectConceptMasterDTO> projectList = new ArrayList<>();
        for (ProjectConceptMasterDTO pcDTO : list) {
            if (pcDTO.getLocation() != null) {
                boolean contains = pcDTO.getLocation().getUpazilas().stream().anyMatch(u -> Objects.equals(u.getId(), upazillaId));
                if (contains) projectList.add(pcDTO);
            }
        }

        dto.setProjectCount(projectList.size());
        dto.setProjectList(projectList);
        return dto;
    }

}

