package com.ibcs.idsdp.services;

import com.ibcs.idsdp.exceptions.ServiceExceptionHolder;
import com.ibcs.idsdp.model.domain.Notice;
import com.ibcs.idsdp.model.repositories.NoticeRepository;
import com.ibcs.idsdp.web.dto.NoticeDTO;
import com.ibcs.idsdp.web.dto.response.NoticeRequestDto;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;


@Service
public class NoticeService extends BaseService<Notice, NoticeDTO>{

    private final NoticeRepository noticeRepository;

    protected NoticeService(NoticeRepository noticeRepository) {
        super(noticeRepository);
        this.noticeRepository = noticeRepository;
    }

    @Override
    public NoticeDTO create(NoticeDTO noticeDTO) {
        validation(noticeDTO);
        return super.create(noticeDTO);
    }

    @Override
    public NoticeDTO update(NoticeDTO noticeDTO) {
        validation(noticeDTO);
        return super.update(noticeDTO);
    }

    private void validation(NoticeDTO noticeDTO) {
        if (isNull(noticeDTO.getTitle()) || isNull(noticeDTO.getSummary()) || isNull(noticeDTO.getPublishedDate())) {
            throw new ServiceExceptionHolder.ResourceNotFoundDuringWriteRequestException("Please fill all required field!");
        }
    }

    private boolean isNull(Object object) {
        if (object == null || object.equals("")) return true;
        return false;
    }

    public List<NoticeDTO> getNoticeByCriteria(NoticeRequestDto noticeRequestDto) {
        if (!isNull(noticeRequestDto) && noticeRequestDto.getTitle() == null){
            noticeRequestDto.setTitle("");
        }
        if (!isNull(noticeRequestDto) && noticeRequestDto.getFromDate() !=null && noticeRequestDto.getToDate() != null){
            return convertForRead(noticeRepository.findAllByTitleContainingIgnoreCaseAndPublishedDateBetweenAndIsActiveAndIsDeleted(
                    noticeRequestDto.getTitle(),noticeRequestDto.getFromDate(), noticeRequestDto.getToDate(), true, false));
        }else {
            return convertForRead(noticeRepository.findAllByTitleContainingIgnoreCaseAndIsActiveAndIsDeleted(noticeRequestDto.getTitle(), true, false));
        }
    }

}
