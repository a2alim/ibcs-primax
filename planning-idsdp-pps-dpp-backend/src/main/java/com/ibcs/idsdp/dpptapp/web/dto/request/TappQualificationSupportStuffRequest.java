package com.ibcs.idsdp.dpptapp.web.dto.request;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.dpptapp.model.domain.TappSupportStuff;
import lombok.Data;

import javax.persistence.CascadeType;
import javax.persistence.JoinColumn;
import javax.persistence.OneToMany;
import java.util.List;

@Data
public class TappQualificationSupportStuffRequest extends UuidIdHolderRequestBodyDTO {

    private String projectConceptUuid;
    private Long projectConceptId;
    private Double gobFund;
    private Double rpaFund;
    private Double dpaFund;
    private Double others;
    private Boolean status;

    private List<TappSupportStuffRequest> tappSupportStuffList;
}
