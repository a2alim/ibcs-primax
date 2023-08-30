package com.ibcs.idsdp.rdpprtapp.web.dto;

import com.ibcs.idsdp.common.web.dto.request.UuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.rdpprtapp.web.dto.request.TppAnnexureFiveRequest;

import java.util.List;

public class TppAnnexureFiveDTO extends UuidIdHolderRequestBodyDTO {
    public List<TppAnnexureFiveRequest> list;
}
