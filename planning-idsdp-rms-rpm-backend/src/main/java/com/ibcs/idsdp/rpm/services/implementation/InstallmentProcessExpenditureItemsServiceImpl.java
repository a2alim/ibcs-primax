package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcess;
import com.ibcs.idsdp.rpm.model.domain.InstallmentProcessExpenditureItems;
import com.ibcs.idsdp.rpm.model.repositories.InstallmentProcessExpenditureItemsRepository;
import com.ibcs.idsdp.rpm.model.repositories.InstallmentProcessRepository;
import com.ibcs.idsdp.rpm.services.InstallmentProcessExpenditureItemsService;
import com.ibcs.idsdp.rpm.web.dto.request.InstallmentProcessExpenditureItemsRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.InstallmentProcessExpenditureItemsResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class InstallmentProcessExpenditureItemsServiceImpl extends BaseService<InstallmentProcessExpenditureItems, InstallmentProcessExpenditureItemsRequestDto, InstallmentProcessExpenditureItemsResponseDto> implements InstallmentProcessExpenditureItemsService {

    private final InstallmentProcessExpenditureItemsRepository installmentProcessExpenditureItemsRepository;

    private final InstallmentProcessRepository installmentProcessRepository;

    public InstallmentProcessExpenditureItemsServiceImpl(ServiceRepository<InstallmentProcessExpenditureItems> repository, InstallmentProcessExpenditureItemsRepository installmentProcessExpenditureItemsRepository, InstallmentProcessRepository installmentProcessRepository) {
        super(repository);
        this.installmentProcessExpenditureItemsRepository = installmentProcessExpenditureItemsRepository;
        this.installmentProcessRepository = installmentProcessRepository;
    }

    @Override
    public Response create(InstallmentProcessExpenditureItemsRequestDto installmentProcessExpenditureItemsRequestDto) {
        Optional<InstallmentProcess> process = installmentProcessRepository.findById(installmentProcessExpenditureItemsRequestDto.getProcessId());
        process.ifPresent(installmentProcessExpenditureItemsRequestDto::setM2InstallmentProcessId);
        return super.create(installmentProcessExpenditureItemsRequestDto);
    }

    @Override
    public Response createList(List<InstallmentProcessExpenditureItemsRequestDto> installmentProcessExpenditureItemsRequestDto) {
        Response<InstallmentProcessExpenditureItemsResponseDto> responseFinal = new Response<>();
        List<InstallmentProcessExpenditureItemsResponseDto> list = new ArrayList<>();
        Optional<InstallmentProcess> process = installmentProcessRepository.findById(installmentProcessExpenditureItemsRequestDto.get(0).getProcessId());
        //process.ifPresent(installmentProcessExpenditureItemsRequestDto::se);
        for (InstallmentProcessExpenditureItemsRequestDto item : installmentProcessExpenditureItemsRequestDto) {
            process.ifPresent(item::setM2InstallmentProcessId);
            if (item.getId() == null) {
                Response response = super.create(item);
                InstallmentProcessExpenditureItemsResponseDto obj = (InstallmentProcessExpenditureItemsResponseDto) response.getObj();
                list.add(obj);
                responseFinal.setSuccess(true);
                responseFinal.setMessage("Save Successfully !.");
                responseFinal.setItems(list);
            } else {
                Response response = super.update(item);
                InstallmentProcessExpenditureItemsResponseDto obj = (InstallmentProcessExpenditureItemsResponseDto) response.getObj();
                list.add(obj);
                responseFinal.setSuccess(true);
                responseFinal.setMessage("Update Successfully !.");
                responseFinal.setItems(list);
            }

        }
        ;


        return responseFinal;
    }

    @Override
    public Response getByProcessId(Long processId) {
        Response<InstallmentProcessExpenditureItems> response = new Response<>();
        Optional<InstallmentProcess> process = installmentProcessRepository.findById(processId);
        if (process.isPresent()) {

            List<InstallmentProcessExpenditureItems> expenditureItems = installmentProcessExpenditureItemsRepository.findByM2InstallmentProcessId(process.get());
            if (expenditureItems.isEmpty()) {
                response.setSuccess(false);
                response.setMessage("Data Not Found");
            } else {
                response.setSuccess(true);
                response.setMessage("Data Found");
                response.setItems(expenditureItems);
            }
        }

        return response;
    }

	@Override
	public List<InstallmentProcessExpenditureItems> findAllByM2InstallmentProcessId(Long id) {
		InstallmentProcess i = new InstallmentProcess();
		i.setId(id);
		return installmentProcessExpenditureItemsRepository.findAllByM2InstallmentProcessIdAndIsDeleted(i, false);
	}

    

}
