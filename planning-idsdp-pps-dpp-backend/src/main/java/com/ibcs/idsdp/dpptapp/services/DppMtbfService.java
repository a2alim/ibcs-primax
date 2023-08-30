package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.dpptapp.web.dto.DppMtbfDTO;

import java.util.List;

public interface DppMtbfService {
    DppMtbfDTO getDppMtbfByPcUuid(String pcUuid);
}
