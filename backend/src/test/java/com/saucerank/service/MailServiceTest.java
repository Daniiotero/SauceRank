package com.saucerank.service;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.ObjectProvider;
import org.springframework.mail.javamail.JavaMailSender;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verifyNoInteractions;

class MailServiceTest {

    @Test
    void sendConEmailNuloNoHaceNada() {
        ObjectProvider<JavaMailSender> provider = mock(ObjectProvider.class);
        MailService mailService = new MailService(provider, true, "noreply@saucerank.com");

        mailService.send(null, "Asunto", "Cuerpo");
        mailService.send("  ", "Asunto", "Cuerpo");

        verifyNoInteractions(provider);
    }

    @Test
    void sendConMailDeshabilitadoLogueaSinEnviar() {
        ObjectProvider<JavaMailSender> provider = mock(ObjectProvider.class);
        MailService mailService = new MailService(provider, false, "noreply@saucerank.com");

        mailService.send("a@b.c", "Asunto", "Cuerpo");

        verifyNoInteractions(provider);
    }
}
