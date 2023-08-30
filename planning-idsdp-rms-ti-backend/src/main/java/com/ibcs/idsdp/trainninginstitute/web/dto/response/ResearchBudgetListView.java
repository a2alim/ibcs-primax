package com.ibcs.idsdp.trainninginstitute.web.dto.response;

import lombok.*;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ResearchBudgetListView {

    private Long itemOfExpenditureId;

    private int expenditureAmount;
}
