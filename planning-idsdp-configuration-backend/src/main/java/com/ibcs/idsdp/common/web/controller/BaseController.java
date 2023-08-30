package com.ibcs.idsdp.common.web.controller;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.*;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RequiredArgsConstructor
@Slf4j
public abstract class BaseController<E extends BaseEntity, D extends IUuidIdHolderRequestBodyDTO> {

    private final BaseService<E, D> service;

    @GetMapping(path=BaseConstant.GET_LIST, produces = "application/json")
    public @ResponseBody List<D> getList() {
        return service.getList();
    }


    @GetMapping(path=BaseConstant.GET_LIST + "/{page}" + "/{size}" , produces = "application/json")
    public @ResponseBody Page<D> getList(@PathVariable("page") int page,@PathVariable("size") int size) {
        return service.getList(new PageableRequestBodyDTO() {{setPage(page); setSize(size);}});
    }

    @Transactional
    @PostMapping(path= BaseConstant.CREATE, produces = "application/json")
    public @ResponseBody D create(@RequestBody D d) {
        return service.create(d);
    }

    @GetMapping(path=BaseConstant.GET_BY_UUID + "/{uuid}" , produces = "application/json")
    public @ResponseBody D getByOid(@PathVariable String uuid) {
        return service.getByUuid(uuid);
    }

    @PostMapping(path=BaseConstant.GET_BY_UUID_SET, produces = "application/json")
    public @ResponseBody List<D> getByIdSet(@RequestBody UuidSetRequestBodyDTO requestBodyDTO) {
        return service.getByUuids(requestBodyDTO.getUuids());
    }

    @GetMapping(path=BaseConstant.GET_BY_ID + "/{id}" , produces = "application/json")
    public @ResponseBody D getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping(path=BaseConstant.GET_BY_ID_SET, produces = "application/json")
    public @ResponseBody List<D> getByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
        return service.getByIds(requestBodyDTO.getIds());
    }

    @Transactional
    @PutMapping(path=BaseConstant.UPDATE, produces = "application/json")
    public @ResponseBody D update(@RequestBody D d) {
        return service.update(d);
    }

    @DeleteMapping(path=BaseConstant.DELETE + "/{uuid}" , produces = "application/json")
    public @ResponseBody BooleanValueHolderDTO delete(@PathVariable String uuid) {
        return service.delete(uuid);
    }
}
