package com.raiza.demo.certification.service;

import com.raiza.demo.certification.dto.CertificationApplicationPayload;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.thymeleaf.TemplateEngine;
import org.thymeleaf.context.Context;
import org.xhtmlrenderer.pdf.ITextRenderer;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;

@Slf4j
@Service
@RequiredArgsConstructor
public class CertificationPdfService {

    private final TemplateEngine templateEngine;

    @Value("${app.pdf.storage-path:./generated-pdfs}")
    private String storagePath;

    /**
     * Genera el PDF a partir del payload usando la plantilla Thymeleaf.
     * Devuelve los bytes del PDF.
     */
    public byte[] generate(CertificationApplicationPayload payload) {
        // 1. Renderizar HTML desde la plantilla Thymeleaf
        Context ctx = new Context();
        ctx.setVariable("payload", payload);
        String html = templateEngine.process("pdf/certification-application", ctx);

        // 2. Convertir XHTML → PDF con Flying Saucer
        try (ByteArrayOutputStream out = new ByteArrayOutputStream()) {
            ITextRenderer renderer = new ITextRenderer();
            renderer.setDocumentFromString(html);
            renderer.layout();
            renderer.createPDF(out);
            return out.toByteArray();
        } catch (Exception e) {
            log.error("Error generating PDF for application {}", payload.applicationCode(), e);
            throw new RuntimeException("PDF generation failed: " + e.getMessage(), e);
        }
    }

    /**
     * Almacena los bytes del PDF en disco.
     * Devuelve la ruta relativa del archivo guardado.
     */
    public String store(byte[] pdfBytes, String applicationCode) {
        try {
            Path dir = Paths.get(storagePath);
            Files.createDirectories(dir);

            String filename = applicationCode + ".pdf";
            Path filePath = dir.resolve(filename);
            Files.write(filePath, pdfBytes);

            log.info("PDF stored at {}", filePath.toAbsolutePath());
            return storagePath + "/" + filename;
        } catch (IOException e) {
            log.error("Error storing PDF for {}", applicationCode, e);
            throw new RuntimeException("PDF storage failed: " + e.getMessage(), e);
        }
    }
}
