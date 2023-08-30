package com.ibcs.idsdp.common.web.controller;

import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseBody;

import com.ibcs.idsdp.common.constants.BaseConstant;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.common.web.dto.request.IUuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.IdSetRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.UuidSetRequestBodyDTO;
import com.ibcs.idsdp.util.Response;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@RequiredArgsConstructor
@Slf4j
public abstract class BaseController<E extends BaseEntity, I extends IUuidIdHolderRequestBodyDTO, O> {

	private final BaseService<E, I, O> service;

	@GetMapping(path = BaseConstant.GET_LIST, produces = "application/json")
	public @ResponseBody Response getList() {
		return service.getList();
	}

	@GetMapping(path = BaseConstant.GET_LIST + "/{page}" + "/{size}", produces = "application/json")
	public @ResponseBody Response getList(@PathVariable("page") int page, @PathVariable("size") int size) {
		return service.getList(new PageableRequestBodyDTO() {
			{
				setPage(page);
				setSize(size);
			}
		});
	}

	
	@PostMapping(path = BaseConstant.CREATE, produces = "application/json")
	public @ResponseBody Response create(@RequestBody I i) {
		return service.create(i);
	}

	@GetMapping(path = BaseConstant.GET_BY_UUID + "/{uuid}", produces = "application/json")
	public @ResponseBody Response getByUuid(@PathVariable String uuid) {
		return service.getByUuid(uuid);
	}

	@PostMapping(path = BaseConstant.GET_BY_UUID_SET, produces = "application/json")
	public @ResponseBody Response getByUuidSet(@RequestBody UuidSetRequestBodyDTO requestBodyDTO) {
		return service.getByUuids(requestBodyDTO.getUuids());
	}

	@GetMapping(path = BaseConstant.GET_BY_ID + "/{id}", produces = "application/json")
	public @ResponseBody Response getById(@PathVariable Long id) {
		return service.getById(id);
	}

	@PostMapping(path = BaseConstant.GET_BY_ID_SET, produces = "application/json")
	public @ResponseBody Response getByIdSet(@RequestBody IdSetRequestBodyDTO requestBodyDTO) {
		return service.getByIds(requestBodyDTO.getIds());
	}

	
	@PutMapping(path = BaseConstant.UPDATE, produces = "application/json")
	public @ResponseBody Response update(@RequestBody I i) {
		return service.update(i);
	}

	@DeleteMapping(path = BaseConstant.DELETE + "/{uuid}", produces = "application/json")
	public @ResponseBody BooleanValueHolderDTO delete(@PathVariable String uuid) {
		return service.delete(uuid);
	}


	@DeleteMapping(path = BaseConstant.SAFE_DELETE + "/{key}/{columnName}/{uuid}", produces = "application/json")
	public @ResponseBody BooleanValueHolderDTO safeDelete(@PathVariable String uuid,@PathVariable String key,@PathVariable String columnName) {
		return service.safeDdelete(uuid,key,columnName);
	}
}
