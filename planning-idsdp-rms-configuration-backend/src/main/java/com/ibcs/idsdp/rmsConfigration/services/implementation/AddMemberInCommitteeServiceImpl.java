package com.ibcs.idsdp.rmsConfigration.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rmsConfigration.model.domain.AddMemberInCommittee;
import com.ibcs.idsdp.rmsConfigration.model.repositories.AddMemberInCommitteeRepository;
import com.ibcs.idsdp.rmsConfigration.services.AddMemberInCommitteeService;
import com.ibcs.idsdp.rmsConfigration.web.dto.request.AddMemberInCommitteeRequest;
import com.ibcs.idsdp.rmsConfigration.web.dto.response.AddMemberInCommitteeResponse;
import com.ibcs.idsdp.util.Response;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class AddMemberInCommitteeServiceImpl extends BaseService<AddMemberInCommittee, AddMemberInCommitteeRequest, AddMemberInCommitteeResponse> implements AddMemberInCommitteeService {

    private final AddMemberInCommitteeRepository addMemberInCommitteeRepository;

    public AddMemberInCommitteeServiceImpl(ServiceRepository<AddMemberInCommittee> repository, AddMemberInCommitteeRepository addMemberInCommitteeRepository) {
        super(repository);
        this.addMemberInCommitteeRepository = addMemberInCommitteeRepository;
    }

    @Override
    public Response<AddMemberInCommitteeResponse> dataSave(AddMemberInCommitteeRequest data) {

        long countVal = addMemberInCommitteeRepository.countByStFiscalYearIdAndStCommitteeTypeIdAndUserIdAndIsDeleted(data.getStFiscalYearId(), data.getStCommitteeTypeId(), data.getUserId(), false);
        if (countVal < 1) {
            return create(data);
        }
        return getErrorResponse("Already Exist!.");
    }

    @Override
    public Response<AddMemberInCommitteeResponse> dataUpdate(AddMemberInCommitteeRequest data) {
        Optional<AddMemberInCommittee> val = addMemberInCommitteeRepository.findByStFiscalYearIdAndStCommitteeTypeIdAndUserIdAndIsDeleted(data.getStFiscalYearId(), data.getStCommitteeTypeId(), data.getUserId(), false);
        if (!val.isPresent() || data.getUuid().equals(val.get().getUuid())) {
            return update(data);
        }

        return getErrorResponse("Already Exist!.");
    }

    @Override
    public ResponseEntity<List<AddMemberInCommittee>> findAllByActiveData(Boolean active) {
        return new ResponseEntity(addMemberInCommitteeRepository.findByActiveAndIsDeleted(active, false), HttpStatus.OK);
    }

}
