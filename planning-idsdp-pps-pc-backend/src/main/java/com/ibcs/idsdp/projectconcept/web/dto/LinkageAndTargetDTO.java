package com.ibcs.idsdp.projectconcept.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;

import java.util.List;

public class LinkageAndTargetDTO extends UuidIdHolderRequestBodyDTO {
    public List<LinkageAndTargetSdgsListDTO> linkageTargetSdgs;
    public List<LinkageAndTargetFiveYearListDTO> linkageTargetFiveYear;
    public List<LinkageAndTargetPerspectiveListDTO> linkageTargetPerspectivePlan;
    public List<LinkageAndTargetDeltaPlanListDTO> linkageTargetDeltaPlan;
    public List<LinkageAndTargetClimateListDTO> linkageTargetClimate;
    public List<LinkageAndTargetPovertyListDTO> linkageTargetPoverty;
    public List<LinkageAndTargetGenderListDTO> linkageTargetGender;

}
