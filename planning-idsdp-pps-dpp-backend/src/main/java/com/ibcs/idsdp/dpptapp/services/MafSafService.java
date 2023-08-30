package com.ibcs.idsdp.dpptapp.services;


import com.ibcs.idsdp.dpptapp.web.dto.MafSafDTO;

public interface MafSafService {
    MafSafDTO getMafSafByPcUuidAndType(String pcUuid, String type);
}
