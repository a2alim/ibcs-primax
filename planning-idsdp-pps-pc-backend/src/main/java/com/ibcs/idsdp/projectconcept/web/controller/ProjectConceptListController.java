package com.ibcs.idsdp.projectconcept.web.controller;

import com.ibcs.idsdp.config.annotations.*;
import com.ibcs.idsdp.projectconcept.services.ProjectConceptListService;
import com.ibcs.idsdp.projectconcept.web.dto.request.UserInformDto;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.Setter;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import com.ibcs.idsdp.config.constants.BaseApiConstant;
import javax.validation.Valid;

@Setter
@Getter
@RestApiController
@AllArgsConstructor
@RequestMapping(BaseApiConstant.PRIVATE_API_ENDPOINT)
public class ProjectConceptListController {

}
