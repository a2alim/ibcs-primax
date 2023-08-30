package com.ibcs.idsdp.common.web.dto.request;

public interface IUuidIdHolderRequestBodyDTO extends IRequestBodyDTO {

    Long getId();

    void setId(Long id);

    String getUuid();

    void setUuid(String uuid);

}
