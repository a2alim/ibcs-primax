package com.ibcs.idsdp.web.dto.response;

import com.ibcs.idsdp.model.domain.Component;
import lombok.Data;

import java.util.List;

@Data
public class ComponentResponse {
    Component component;
    List<ModuleResponse> moduleList;
}
