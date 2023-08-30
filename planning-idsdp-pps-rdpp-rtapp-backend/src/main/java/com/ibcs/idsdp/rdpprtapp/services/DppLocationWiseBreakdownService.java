package com.ibcs.idsdp.rdpprtapp.services;

import com.ibcs.idsdp.rdpprtapp.web.dto.DppLocationWiseBreakdownDTO;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface DppLocationWiseBreakdownService {

    ResponseEntity<List<DppLocationWiseBreakdownDTO>> createList(List<DppLocationWiseBreakdownDTO> dtoList);

    ResponseEntity<List<DppLocationWiseBreakdownDTO>> updateList(List<DppLocationWiseBreakdownDTO> dtoList);

    ResponseEntity<List<DppLocationWiseBreakdownDTO>> getByProjectConceptMasterId(Long projectConceptMasterId);

}
