package com.ibcs.idsdp.rpm.web.dto.request;

import com.ibcs.idsdp.rpm.enums.LetterType;
import com.ibcs.idsdp.rpm.enums.Status;
import com.ibcs.idsdp.rpm.model.domain.NoteForNotification;
import lombok.Data;

import java.util.List;

import javax.persistence.Column;

/**
 * @author moniruzzaman.rony
 * @create 10/21/21
 * @github `https://github.com/moniruzzamanrony`
 */
@Data
public class NotificationRequest {

	private Long fiscalYearId;

	private String subject;

	private String details;

	private List<NoteForNotification> recipientUserId;

	private Integer sendType;

	private String messageText;	
	
    private Long senderUserId;
   
    private boolean isSend;
    
    private String sendTo;
    
    private String sendToMobile;
    

}
