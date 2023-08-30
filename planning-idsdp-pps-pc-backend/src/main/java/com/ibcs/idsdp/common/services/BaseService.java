package com.ibcs.idsdp.common.services;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.common.model.domain.BaseEntity;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.web.dto.request.BooleanValueHolderDTO;
import com.ibcs.idsdp.common.web.dto.request.IUuidIdHolderRequestBodyDTO;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import lombok.NonNull;
import org.modelmapper.ModelMapper;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.lang.reflect.ParameterizedType;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

public abstract class BaseService<E extends BaseEntity, D extends IUuidIdHolderRequestBodyDTO>{

    @Autowired
    private IdGeneratorComponent idGeneratorComponent;

    private ModelMapper modelMapper;

    private final ServiceRepository<E> repository;

    private static final int DEFAULT_PAGE_SIZE = 1000000;

    protected BaseService(ServiceRepository<E> repository) {
        this.repository = repository;
        modelMapper = new ModelMapper();
        modelMapper.getConfiguration().setAmbiguityIgnored(true);
    }

    public List<D> getList() {
        return convertForRead(repository.findAllByIsDeleted(false));
    }

    public Page<D> getList(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<E> ePage = repository.findAllByIsDeleted(false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }

    public D getByUuid(@NonNull String uuid) {
        return convertForRead(repository.findByUuidAndIsDeleted(uuid, false)
                .orElseThrow(() -> new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
                        "No " + getEntityClass().getSimpleName() + " Found with UUID: " + uuid)));
    }

    public List<D> getByUuids(Set<String> uuids) {
        List<E> list = repository.findAllByUuidInAndIsDeleted(uuids,false);
        if (list.isEmpty()) return new ArrayList<>();
        return convertForRead(list);
    }

    public D getById(@NonNull Long id) {
        return convertForRead(repository.findByIdAndIsDeleted(id, false)
                .orElseThrow(() -> new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException(
                        "No " + getEntityClass().getSimpleName() + " Found with ID: " + id)));
    }

    public List<D> getByIds(Set<Long> ids) {
        List<E> list = repository.findAllByIdInAndIsDeleted(ids,false);
        if (list.isEmpty()) return new ArrayList<>();
        return convertForRead(list);
    }

    public D create(D d) {
        return convertForRead(createEntity(d));
    }

    public D update(D d) {
        return convertForRead(updateEntity(d));
    }

    public BooleanValueHolderDTO delete(@NonNull String oid) {
        deleteEntity(oid);
        return new BooleanValueHolderDTO() {{ setValue(true); }};
    }

    protected E createEntity(D body) {
        E e = convertForCreate(body);
        e.setUuid(idGeneratorComponent.generateUUID());
        e.setCreatedOn(LocalDate.now());
        e.setIsDeleted(false);
        return repository.save(e);
    }

    protected E updateEntity(D body) {
        String uuid = body.getUuid();
        if (uuid == null)
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("No Id Provided for " + getEntityClass().getSimpleName());
        E e = getByUuidForRead(uuid);
        body.setId(e.getId());
        convertForUpdate(body, e);
        e.setUpdatedOn(LocalDate.now());
        e.setIsDeleted(false);
        return repository.save(e);
    }

    protected void deleteEntity(@NonNull String oid) {
        if (oid == null)
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("No Id Provided for " + getEntityClass().getSimpleName());
        E e = getByUuidForRead(oid);
        e.setIsDeleted(true);
        e.setUpdatedOn(LocalDate.now());
        repository.save(e);
    }

    public E getByUuidForRead(@NonNull String oid) {
        return repository.findByUuidAndIsDeleted(oid,false).orElse(null);
    }

    protected D convertForRead(E e) {
        return modelMapper.map(e, getDtoClass());
    }

    protected List<D> convertForRead(List<E> e) {
        return e.stream().map(this::convertForRead).collect(Collectors.toList());
    }

    protected E convertForCreate(D d) {
        return modelMapper.map(d, getEntityClass());
    }

    protected void convertForUpdate(D d, E e) {
        BeanUtils.copyProperties(d, e);
    }

    @SuppressWarnings("unchecked")
    private Class<E> getEntityClass() {
        return (Class<E>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[0];
    }

    @SuppressWarnings("unchecked")
    private Class<D> getDtoClass() {
        return (Class<D>) ((ParameterizedType) getClass().getGenericSuperclass()).getActualTypeArguments()[1];
    }

    public Pageable getPageable(PageableRequestBodyDTO requestDTO) {
        PageableRequestBodyDTO pageSettings = new PageableRequestBodyDTO(){{setPage(0);setSize(DEFAULT_PAGE_SIZE);}};
        if (requestDTO != null && requestDTO.getPage() != null && requestDTO.getSize() != null) {
            pageSettings = requestDTO;
        }
        return PageRequest.of(pageSettings.getPage(), pageSettings.getSize());
    }


}
