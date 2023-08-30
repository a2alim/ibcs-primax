package com.ibcs.idsdp.idsdpconfigration.web.dto.request;

import lombok.Data;

import java.util.List;

@Data
public class ProjectMoveRequest {
    private List<Long> projectIds;
}
