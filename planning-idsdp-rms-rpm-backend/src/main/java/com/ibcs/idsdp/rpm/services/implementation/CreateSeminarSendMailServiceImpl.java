package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarSendMail;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarSendMailRepository;
import com.ibcs.idsdp.rpm.services.CreateSeminarSendMailService;
import com.ibcs.idsdp.rpm.web.dto.request.CreateSeminarSendMailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.CreateSeminarSendMailResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.List;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class CreateSeminarSendMailServiceImpl extends BaseService<CreateSeminarSendMail, CreateSeminarSendMailRequestDto, CreateSeminarSendMailResponseDto> implements CreateSeminarSendMailService {

    private final CreateSeminarSendMailRepository createSeminarSendMailRepository;

    private final CreateSeminarRepository createSeminarRepository;

    public CreateSeminarSendMailServiceImpl(ServiceRepository<CreateSeminarSendMail> repository, CreateSeminarSendMailRepository createSeminarSendMailRepository, CreateSeminarRepository createSeminarRepository) {
        super(repository);
        this.createSeminarSendMailRepository = createSeminarSendMailRepository;
        this.createSeminarRepository = createSeminarRepository;
    }

    @Override
    public Response<CreateSeminarSendMail> doSave(List<CreateSeminarSendMailRequestDto> requestDto) {
        Response<CreateSeminarSendMail> response = new Response<>();

        try {
            requestDto.forEach(createSeminarTimeScheduleRequestDto -> {
                //seminar
                Optional<CreateSeminar> seminar = createSeminarRepository.findById(createSeminarTimeScheduleRequestDto.getSeminarId());
                if (seminar.isPresent()) {
                    createSeminarTimeScheduleRequestDto.setM2CreateSeminarId(seminar.get());
                }
                super.create(createSeminarTimeScheduleRequestDto);
            });
            response.setMessage("Saved Success");
            response.setSuccess(true);

        } catch (Exception e) {
            response.setMessage("Saved Failed");
            response.setSuccess(true);
        }
        return response;
    }

    @Override
    public Response<CreateSeminarSendMail> doUpdate(List<CreateSeminarSendMailRequestDto> requestDto) {
        Response<CreateSeminarSendMail> response = new Response<>();

        try {
            requestDto.forEach(createSendMail -> {
                //seminar
                Optional<CreateSeminar> seminar = createSeminarRepository.findById(createSendMail.getSeminarId());

                if (seminar.isPresent()) {
                    createSendMail.setM2CreateSeminarId(seminar.get());
                }
                super.update(createSendMail);
            });

            response.setMessage("Update Success");
            response.setSuccess(true);

        } catch (Exception e) {

            response.setMessage("Update Failed");
            response.setSuccess(false);

        }

        return response;
    }

}
