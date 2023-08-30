package com.ibcs.idsdp.idsdpconfigration.services.implementation;


import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.common.web.dto.request.PageableRequestBodyDTO;
import com.ibcs.idsdp.idsdpconfigration.model.domain.Department;
import com.ibcs.idsdp.idsdpconfigration.model.repositories.DepartmentRepository;
import com.ibcs.idsdp.idsdpconfigration.services.DepartmentService;
import com.ibcs.idsdp.idsdpconfigration.web.dto.DepartmentDTO;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Slf4j
@Service
public class DepartmentServiceImp extends BaseService<Department, DepartmentDTO> implements DepartmentService {

    private final DepartmentRepository repository;
    private final IdGeneratorComponent idGeneratorComponent;

    public DepartmentServiceImp(DepartmentRepository repository, IdGeneratorComponent idGeneratorComponent) {
        super(repository);
        this.repository = repository;
        this.idGeneratorComponent = idGeneratorComponent;
    }

    /**
     * for convertForCreate
     * @param departmentDTO
     * @return
     */
    @Override
    protected Department convertForCreate(DepartmentDTO departmentDTO) {
        Department department = super.convertForCreate(departmentDTO);
        department.setCode(idGeneratorComponent.generateCode(departmentDTO.getNameEn(), repository.count()));
        return department;
    }

    /**
     * for convertForUpdate
     * @param departmentDTO
     * @param department
     */
    @Override
    protected void convertForUpdate(DepartmentDTO departmentDTO, Department department) {
        departmentDTO.setCode(department.getCode());
        super.convertForUpdate(departmentDTO, department);
    }

    /**
     * for get Active Department
     * @param requestBodyDTO
     * @return
     */
    @Override
    public Page<DepartmentDTO> getActiveDepartment(PageableRequestBodyDTO requestBodyDTO) {
        Pageable pageable = this.getPageable(requestBodyDTO);
        Page<Department> ePage = repository.findAllByStatusAndIsDeleted(true, false, pageable);
        return new PageImpl<>(convertForRead(ePage.getContent()), pageable, ePage.getTotalElements());
    }
}


