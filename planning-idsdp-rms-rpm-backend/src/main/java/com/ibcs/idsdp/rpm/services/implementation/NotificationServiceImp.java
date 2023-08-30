package com.ibcs.idsdp.rpm.services.implementation;

import com.ibcs.idsdp.common.config.IdGeneratorComponent;
import com.ibcs.idsdp.common.model.repositories.ServiceRepository;
import com.ibcs.idsdp.common.services.BaseService;
import com.ibcs.idsdp.config.model.AccessTokenDetail;
import com.ibcs.idsdp.rpm.client.UaaClientService;
import com.ibcs.idsdp.rpm.model.domain.Notification;
import com.ibcs.idsdp.rpm.model.repositories.NotificationRepository;
import com.ibcs.idsdp.rpm.services.MailService;
import com.ibcs.idsdp.rpm.services.NotificationService;
import com.ibcs.idsdp.rpm.services.SmsService;
import com.ibcs.idsdp.rpm.web.dto.request.MailRequestDto;
import com.ibcs.idsdp.rpm.web.dto.request.NotificationNoteRequest;
import com.ibcs.idsdp.rpm.web.dto.request.NotificationRequest;
import com.ibcs.idsdp.rpm.web.dto.request.SmsDto;
import com.ibcs.idsdp.util.Response;
import lombok.AllArgsConstructor;
import org.springframework.beans.BeanUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.provider.authentication.OAuth2AuthenticationDetails;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.Optional;

/**
 * @author moniruzzaman.rony
 * @create 11/7/21
 * @github `https://github.com/moniruzzamanrony`
 */

@Service
@Transactional
public class NotificationServiceImp extends BaseService<Notification, NotificationNoteRequest, NotificationNoteRequest> implements NotificationService {


	private final NotificationRepository notificationRepository;
	private final MailService mailService;
	private final SmsService smsService;
	private final UaaClientService uaaClientService;

	@Autowired
	private IdGeneratorComponent idGeneratorComponent;

	protected NotificationServiceImp(ServiceRepository<Notification> repository,
									 MailService mailService,
									 SmsService smsService,
									 UaaClientService uaaClientService,
									 NotificationRepository notificationRepository) {
		super(repository);
		this.mailService = mailService;
		this.smsService = smsService;
		this.uaaClientService = uaaClientService;
		this.notificationRepository = notificationRepository;
	}

	@Override
	public Response createNotification(NotificationRequest notificationRequest) {
		Response<Notification> response = new Response<Notification>();
		try {
			Notification notification = new Notification();
			BeanUtils.copyProperties(notificationRequest, notification);
//			notification.setRecipientUserId(notificationRequest.getRecipientUserId());
			notification.setSenderUserId(1l);
			notificationRepository.save(notification);
			response.setSuccess(true);
			response.setObj(notification);
			response.setMessage("Saved Successfully!");
		} catch (Exception e) {
			response.setSuccess(false);
			response.setMessage(e.getMessage());
		}

		return response;
	}

	@Override
	public Response addNoteForNotification(Long notificationId, NotificationNoteRequest notificationNoteRequest) {
		Response<Notification> response = new Response<Notification>();
		try {
			Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);

			if (!notificationOptional.isPresent()) {
				response.setSuccess(false);
				response.setMessage("Notification Not Found");
				return response;
			}
			Notification notification = notificationOptional.get();
			notification.getRecipientUserId().forEach(res -> {
				if (res.getUserId().equals('1')) {
					BeanUtils.copyProperties(notificationNoteRequest, res);
				}
			});

			notificationRepository.save(notification);
			response.setSuccess(true);
			response.setObj(notification);
			response.setMessage("Note Added");
		} catch (Exception e) {
			response.setSuccess(false);
			response.setMessage(e.getMessage());
		}

		return response;
	}

	@Override
	public Response updateNotifications(Long notificationId, NotificationRequest notificationRequest) {
		Response<Notification> response = new Response<Notification>();
		try {
			Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);

			if (!notificationOptional.isPresent()) {
				response.setSuccess(false);
				response.setMessage("Notification Not Found");
				return response;
			}
			Notification notification = notificationOptional.get();
			BeanUtils.copyProperties(notificationRequest, notification);
//			notification.setRecipientUserId(notificationRequest.getRecipientUserId());

			notificationRepository.save(notification);
			response.setSuccess(true);
			response.setObj(notification);
			response.setMessage("Saved Successfully!");
		} catch (Exception e) {
			response.setSuccess(false);
			response.setMessage(e.getMessage());
		}

		return response;
	}

	@Override
	public Response getNotificationsByNotificationId(Long notificationId) {
		Response<Notification> response = new Response<Notification>();
		try {
			Optional<Notification> notificationOptional = notificationRepository.findById(notificationId);

			if (!notificationOptional.isPresent()) {
				response.setSuccess(false);
				response.setMessage("Notification Not Found");
				return response;
			}
			Notification notification = notificationOptional.get();

			response.setSuccess(true);
			response.setObj(notification);
			response.setMessage("Data found");
		} catch (Exception e) {
			response.setSuccess(false);
			response.setMessage(e.getMessage());
		}

		return response;
	}

	@Override
	public Response getNotifications() {
		Response<Notification> response = new Response<Notification>();
		response.setSuccess(true);
		response.setItems(notificationRepository.findAll());
		response.setMessage("Data found");
		return response;
	}

	@Override
	public Response sendNotifications(Long notificationId) {

		Optional<Notification> optional = notificationRepository.findById(notificationId);

		if (!optional.isPresent()) {
			return new Response() {
				{
					setSuccess(false);
					setMessage("Notification not found!.");

				}
			};
		}

		Notification notification = optional.get();

		if (notification.getSendType() == null) {
			return new Response() {
				{
					setSuccess(false);
					setMessage("Send type not found!.");
				}
			};
		}

//		ResponseEntity<List<UserResponse>> userResponse = uaaClientService.getUserByIdSet(notification
//				                                                          .getRecipientUserId()
//				                                                          .stream()
//				                                                          .map(NoteForNotification::getUserId)
//				                                                          .collect(Collectors.toSet()));

//		List<UserResponse> userList = userResponse.getBody();
//		

//		String emailIds = userList.stream()
//				                  .map(UserResponse::getEmailId)
//				                  .collect(Collectors.joining(","));
//		
//		
//		String phonNumberS=userList.stream()
//				                   .map(UserResponse::getMobileNumber)
//				                   .collect(Collectors.joining(","));

		String emailIds = notification.getSendTo();

		String phonNumberS = notification.getSendToMobile();

		if (notification.getSendType() != null && notification.getSendType().equals(1)) {
			mailService.sendMail(new MailRequestDto() {
				{
					setBody("<p style=\"font-weight:bold\">Subject: "+notification.getSubject()+"</p>"+notification.getDetails());
					setTo(emailIds);
					setSubject(notification.getSubject());
					setTemplateName("default-email-template");
					setIsAttachment(false);
				}
			});
		}

		if (notification.getSendType() != null && notification.getSendType().equals(2)) {
			smsService.sendSms(new SmsDto() {
				{
					setNumber(phonNumberS);
					setMessage(notification.getMessageText());
				}
			});
		}

		if (notification.getSendType() != null && notification.getSendType().equals(3)) {

			mailService.sendMail(new MailRequestDto() {
				{
					setBody("<p style=\"font-weight:bold\">Subject: "+notification.getSubject()+"</p>"+notification.getDetails());
					setTo(emailIds);
					setSubject(notification.getSubject());
					setTemplateName("default-email-template");
					setIsAttachment(false);
				}
			});

			smsService.sendSms(new SmsDto() {
				{
					setNumber(phonNumberS);
					setMessage(notification.getMessageText());
				}
			});
		}

		String userId = userDetails().getId();
		NotificationRequest notificationRequest = new NotificationRequest();
		BeanUtils.copyProperties(notification, notificationRequest);
		notificationRequest.setRecipientUserId(notification.getRecipientUserId());
		notificationRequest.setSend(true);
		notificationRequest.setSenderUserId(Long.parseLong(userId));

		return updateNotifications(notificationId, notificationRequest);

	}

	private AccessTokenDetail userDetails() {
		return (AccessTokenDetail) ((OAuth2AuthenticationDetails) SecurityContextHolder.getContext().getAuthentication()
				.getDetails()).getDecodedDetails();
	}
}
