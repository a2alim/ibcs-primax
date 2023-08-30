package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.model.domain.Resources;
import com.ibcs.idsdp.model.repositories.ResourcesRepository;
import com.ibcs.idsdp.web.dto.ResourcesDTO;
import com.ibcs.idsdp.web.dto.ResourcesFilterDTO;
import com.ibcs.idsdp.web.dto.request.ResourcesSearchDTO;
import com.ibcs.idsdp.web.dto.request.SearchWithPageableRequest;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;


@Service
public class ResourcesService extends BaseService<Resources, ResourcesDTO>{

    private final ResourcesRepository resourcesRepository;

    protected ResourcesService(ResourcesRepository resourcesRepository) {
        super(resourcesRepository);
        this.resourcesRepository = resourcesRepository;
    }

    @Override
    public ResourcesDTO create(ResourcesDTO resourcesDTO) {
        validation(resourcesDTO);
        setYearMonth(resourcesDTO);
        return super.create(resourcesDTO);
    }

    @Override
    public ResourcesDTO update(ResourcesDTO resourcesDTO) {
        validation(resourcesDTO);
        setYearMonth(resourcesDTO);
        return super.update(resourcesDTO);
    }

    private void setYearMonth(ResourcesDTO resourcesDTO) {
        LocalDateTime localDate = resourcesDTO.getPublishedDate().toInstant().atZone(ZoneId.systemDefault()).toLocalDateTime();
        resourcesDTO.setYear(String.valueOf(localDate.getYear()));
        resourcesDTO.setMonth(localDate.getMonth().name());
    }

    public List<ResourcesDTO> getActiveList() {
        return convertForRead(resourcesRepository.findAllByIsActiveAndIsDeletedOrderById(true, false));
    }

    public List<ResourcesDTO> searchResources(ResourcesSearchDTO searchDTO) {
        validationSearch(searchDTO);
        return convertForRead(resourcesRepository.searchResources(searchDTO.getCategory(), searchDTO.getYear(), searchDTO.getMonth()));
    }

    private void validationSearch(ResourcesSearchDTO searchDTO) {
        if (isNull(searchDTO.getCategory())) searchDTO.setCategory(null);
        if (isNull(searchDTO.getYear())) searchDTO.setYear(null);
        if (isNull(searchDTO.getMonth())) searchDTO.setMonth(null);
    }

    public ResourcesFilterDTO getFilterList() {
        List<String> categoryList = resourcesRepository.findDistinctCategoryList();
        List<String> yearList = resourcesRepository.findDistinctYearList();
        List<String> monthList = resourcesRepository.findDistinctMonthList();

        ResourcesFilterDTO result = new ResourcesFilterDTO();
        result.setCategoryList(categoryList);
        result.setYearList(yearList);
        result.setMonthList(monthList);
        return result;
    }

    public Page<Resources> findAllByPageable(SearchWithPageableRequest request){
        PageRequest pageRequest = PageRequest.of(request.getPage(), request.getSize());
        Page<Resources> pageResult =  resourcesRepository.findAllByPageable(false, true, request.getValue().toLowerCase(), pageRequest);
        return new PageImpl<>(pageResult.getContent(), pageRequest, pageResult.getTotalElements());
    }

    public List<String> getYearListByCategory(String category) {
        return resourcesRepository.findDistinctByCategory(category);
    }

    public List<String> getMonthListByYear(String year) {
        return resourcesRepository.findDistinctByYear(year);
    }

    private void validation(ResourcesDTO resourcesDTO) {
        if (isNull(resourcesDTO.getTitle()) || isNull(resourcesDTO.getCategory()) || isNull(resourcesDTO.getSummary()) || isNull(resourcesDTO.getPublishedDate())) {
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("Please fill all required field!");
        }
    }

    private boolean isNull(Object object) {
        if (object == null || object.equals("")) return true;
        return false;
    }

    private boolean isNotNull(Object object) {
        return !isNull(object);
    }
}
