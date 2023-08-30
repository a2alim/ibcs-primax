package com.ibcs.idsdp.rdpprtapp.web.dto.response;

import com.ibcs.idsdp.rdpprtapp.model.domain.DppObjectiveCost;
import com.ibcs.idsdp.rdpprtapp.model.domain.TappObjectiveCost;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ApprovalAndNotApprovalProjectListResponseDTO {

    private List<DppObjectiveCost> rdppApprovedList;
    private List<DppObjectiveCost> rdppNotApprovedList;
    private List<TappObjectiveCost> rtappApprovedList;
    private List<TappObjectiveCost> rtappNotApprovedList;

}
