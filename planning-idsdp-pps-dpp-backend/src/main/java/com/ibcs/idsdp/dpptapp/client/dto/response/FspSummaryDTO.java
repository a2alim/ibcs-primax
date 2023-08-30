package com.ibcs.idsdp.dpptapp.client.dto.response;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import lombok.Data;

import java.util.Date;

@Data
public class FspSummaryDTO extends UuidIdHolderRequestBodyDTO {

    private String titleEn;

    private String titleBn;

    private String sponsoringMinistry;

    private String executingAgency;

    private Date dateOfCommencement;

    private Date dateOfCompletion;

    private String background;

    private String objective;

    private String briefOutlineScope;

    private String output;

    private String needJustification;

    private Double totalAmount;

    private Double gobAmount;

    private Double feGobAmount;

    private Double ownFundAmount;

    private Double feOwnFundAmount;

    private Double paAmount;

    private Double rpaAmount;

    private Double dpaAmount;

    private Double otherAmount;

    private Double feOtherAmount;

    private String methodologyOfConductingStudy;

    private String financingArrangement;

    private String listOfMachinery;

    private String projectConceptMasterUuid;

    private Long projectConceptMasterId;

    private Long paripatraVersionId;

    private Long agencyId;
}
