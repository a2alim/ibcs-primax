package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ModeFinanceMoveRequest {
    private List<Long> modeFinanceIds;
}
