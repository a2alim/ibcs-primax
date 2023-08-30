package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminar;
import com.ibcs.idsdp.rpm.model.domain.CreateSeminarParticipating;
import com.ibcs.idsdp.rpm.model.repositories.CreateSeminarRepository;
import com.ibcs.idsdp.rpm.model.repositories.ParticipatingSeminarRepository;
import com.ibcs.idsdp.rpm.services.ParticipatingSeminarService;
import com.ibcs.idsdp.rpm.web.dto.request.ParticipatingSeminarRequestDto;
import com.ibcs.idsdp.rpm.web.dto.response.ParticipatingSeminarResponseDto;
import com.ibcs.idsdp.util.Response;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * @author rakibul.hasan
 * @create 10/21/2021
 * @github `https://github.com/rhmtechno`
 */
@Service
@Transactional
public class ParticipatingSeminarServiceImpl extends BaseService<CreateSeminarParticipating, ParticipatingSeminarRequestDto, ParticipatingSeminarResponseDto> implements ParticipatingSeminarService {

    private final ParticipatingSeminarRepository participatingSeminarRepository;
    private final CreateSeminarRepository createSeminarRepository;

    public ParticipatingSeminarServiceImpl(ServiceRepository<CreateSeminarParticipating> repository, ParticipatingSeminarRepository participatingSeminarRepository, CreateSeminarRepository createSeminarRepository) {
        super(repository);
        this.participatingSeminarRepository = participatingSeminarRepository;
        this.createSeminarRepository = createSeminarRepository;
    }

    @Override
    public Response create(ParticipatingSeminarRequestDto participatingSeminarRequestDto) {
        //seminar

        Optional<CreateSeminar> seminar = createSeminarRepository.findById(participatingSeminarRequestDto.getSeminarId());

        if (seminar.isPresent()) {
            participatingSeminarRequestDto.setM2CreateSeminarId(seminar.get());
        }
        return super.create(participatingSeminarRequestDto);
    }


    @Override
    public Response update(ParticipatingSeminarRequestDto participatingSeminarRequestDto) {

        Optional<CreateSeminar> seminar = createSeminarRepository.findById(participatingSeminarRequestDto.getSeminarId());

        if (seminar.isPresent()) {
            participatingSeminarRequestDto.setM2CreateSeminarId(seminar.get());
        }

        return super.update(participatingSeminarRequestDto);
    }
}
