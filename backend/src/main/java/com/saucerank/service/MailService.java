package com.saucerank.service;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

@Service
public class MailService {

    private static final Logger log = LoggerFactory.getLogger(MailService.class);

    private final ObjectProvider<JavaMailSender> mailSenderProvider;
    private final boolean mailEnabled;
    private final String mailFrom;

    public MailService(ObjectProvider<JavaMailSender> mailSenderProvider,
                       @Value("${app.mail.enabled:false}") boolean mailEnabled,
                       @Value("${app.mail.from:noreply@saucerank.com}") String mailFrom) {
        this.mailSenderProvider = mailSenderProvider;
        this.mailEnabled = mailEnabled;
        this.mailFrom = mailFrom;
    }

    public void send(String to, String subject, String text) {
        if (to == null || to.isBlank()) {
            return;
        }
        if (!mailEnabled) {
            log.info("[DEV] Email a {} — Asunto: {} — Cuerpo: {}", to, subject, text);
            return;
        }

        JavaMailSender sender = mailSenderProvider.getIfAvailable();
        if (sender == null) {
            log.error("app.mail.enabled=true pero no hay SMTP configurado. No se pudo enviar el correo.");
            return;
        }

        SimpleMailMessage message = new SimpleMailMessage();
        message.setFrom(mailFrom);
        message.setTo(to);
        message.setSubject(subject);
        message.setText(text);
        sender.send(message);
    }
}
