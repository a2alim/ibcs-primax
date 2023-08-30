package com.ibcs.idsdp.web.dto.response;

import lombok.Data;

import javax.persistence.Id;
import java.util.List;

@Data
public class ModuleResponse {
    @Id
    private Long id;
    private String name;
    private List<SubModuleResponse> subModuleList;
}
