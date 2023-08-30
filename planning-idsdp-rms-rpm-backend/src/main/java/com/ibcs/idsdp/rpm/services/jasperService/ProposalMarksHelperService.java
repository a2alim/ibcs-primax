package com.ibcs.idsdp.rpm.services.jasperService;

import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.rpm.client.RmsConfigurationClientService;
import com.ibcs.idsdp.rpm.client.dto.response.*;
import com.ibcs.idsdp.rpm.constants.JasperConstant;
import com.ibcs.idsdp.rpm.model.domain.ResearcherProfilePersonalInfoMaster;
import com.ibcs.idsdp.rpm.model.repositories.ResearcherProfilePersonalInfoMasterRepository;
import com.ibcs.idsdp.rpm.services.ResearcherProfilePersonalInfoMasterService;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * Created by : rakibul.hasan on 1/26/2022 5:35 PM
 * github : https://github.com/rhmtechno
 */
@Service
public class ProposalMarksHelperService {

    private final RmsConfigurationClientService rmsConfigurationClientService;
    private final ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService;
    private final ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository;

    public ProposalMarksHelperService(RmsConfigurationClientService rmsConfigurationClientService, ResearcherProfilePersonalInfoMasterService researcherProfilePersonalInfoMasterService, ResearcherProfilePersonalInfoMasterRepository researcherProfilePersonalInfoMasterRepository) {
        this.rmsConfigurationClientService = rmsConfigurationClientService;
        this.researcherProfilePersonalInfoMasterService = researcherProfilePersonalInfoMasterService;
        this.researcherProfilePersonalInfoMasterRepository = researcherProfilePersonalInfoMasterRepository;
    }

    //getting sector from rms configuration
    public List<SectorTypeResponseDto> getSector(IdSetRequestBodyDTO requestBodyDTO) {
        List<SectorTypeResponseDto> items = new ArrayList<>();
        Response<SectorTypeResponseDto> bySectorTypeByIdSet = rmsConfigurationClientService.getBySectorTypeByIdSet(requestBodyDTO);
        if (bySectorTypeByIdSet.isSuccess()) {
            items = bySectorTypeByIdSet.getItems();
        }
        return items;
    }


    //getting sector from rms configuration
    public List<ResearchCategoryTypeResponseDto> getResearchCategory(IdSetRequestBodyDTO requestBodyDTO) {
        List<ResearchCategoryTypeResponseDto> items = new ArrayList<>();
        Response<ResearchCategoryTypeResponseDto> byResearchCategoryTypeByIdSet = rmsConfigurationClientService.getByResearchCategoryTypeByIdSet(requestBodyDTO);
        if (byResearchCategoryTypeByIdSet.isSuccess()) {
            items = byResearchCategoryTypeByIdSet.getItems();
        }
        return items;
    }


    //getting sub sector from rms configuration
    public List<SubSectorResponseDto> getSubSector(IdSetRequestBodyDTO requestBodyDTO) {
        List<SubSectorResponseDto> items = new ArrayList<>();
        Response<SubSectorResponseDto> bySubSectorByIdSet = rmsConfigurationClientService.getBySubSectorByIdSet(requestBodyDTO);
        if (bySubSectorByIdSet.isSuccess()) {
            items = bySubSectorByIdSet.getItems();
        }
        return items;
    }


    //getting Fiscal Year from rms configuration
    public List<FiscalResponseDto> getFiscalYear(IdSetRequestBodyDTO requestBodyDTO) {
        List<FiscalResponseDto> items = new ArrayList<>();
        Response<FiscalResponseDto> byFiscalYearIdSet = rmsConfigurationClientService.getByFiscalYearIdSet(requestBodyDTO);
        if (byFiscalYearIdSet.isSuccess()) {
            items = byFiscalYearIdSet.getItems();
        }
        return items;
    }



    /*
     * Address
     * */

    public UserResponse getAddress(Long personalId, String addressType) {
        Optional<ResearcherProfilePersonalInfoMaster> personalInfo = researcherProfilePersonalInfoMasterRepository.findById(personalId);
        UserResponse userResponse = new UserResponse();
        DivisionResponse divisionResponse = null;
        ZillaResponse zillaResponse = null;
        UpaZillaResponse upaZillaResponse = null;
        Long divisionId = null;
        Long districtId = null;
        Long upzilaId = null;
        if (personalInfo.isPresent()) {
            ResearcherProfilePersonalInfoMaster researcherProfilePersonalInfoMaster = personalInfo.get();

            /*
            * Set Ins Address
            * */
            userResponse.setInstAddress(researcherProfilePersonalInfoMaster.getInstAddressDetails());

            if (addressType.equalsIgnoreCase(JasperConstant.ADDRESS_PERMANENT)) {
                divisionId = researcherProfilePersonalInfoMaster.getDivisionId();
                districtId = researcherProfilePersonalInfoMaster.getDistrictId();
                upzilaId = researcherProfilePersonalInfoMaster.getUpzilaId();
                userResponse.setAnotherDetails(researcherProfilePersonalInfoMaster.getAnotherDetails());
                // Long unionId = researcherProfilePersonalInfoMaster.getUnionId();

            }

            if (addressType.equalsIgnoreCase(JasperConstant.ADDRESS_PRESENT)) {
                divisionId = researcherProfilePersonalInfoMaster.getPreDivisionId();
                districtId = researcherProfilePersonalInfoMaster.getPreDistrictId();
                upzilaId = researcherProfilePersonalInfoMaster.getPreUpzilaId();
                userResponse.setPreAnotherDetails(researcherProfilePersonalInfoMaster.getPreAnotherDetails());
                // Long unionId = researcherProfilePersonalInfoMaster.getPreUnionId();

            }

            if (divisionId != null && divisionId!=0) {
                divisionResponse = rmsConfigurationClientService.findByDivisionId(divisionId).getObj();
                userResponse.setDivisionDto(divisionResponse.getNameEn());
            }
            if (districtId != null && districtId!=0) {
                zillaResponse = rmsConfigurationClientService.findByZillaId(districtId).getObj();
                userResponse.setDistrictDto(zillaResponse.getNameEn());
            }
            if (upzilaId != null && upzilaId!=0) {
                upaZillaResponse = rmsConfigurationClientService.findByUpazillaId(upzilaId).getObj();
                userResponse.setUpzilaDto(upaZillaResponse.getNameEn());
            }

        }

        return userResponse;
    }


}
