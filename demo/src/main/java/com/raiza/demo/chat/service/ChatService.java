package com.raiza.demo.chat.service;

import com.raiza.demo.chat.dto.ChatRequest;
import com.raiza.demo.chat.dto.ChatResponse;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import org.springframework.web.client.RestClientException;

import java.util.List;

@Service
public class ChatService {

    private static final Logger log = LoggerFactory.getLogger(ChatService.class);

    private static final String SYSTEM_PROMPT = """
            ## ROL E IDENTIDAD
            Eres Raíza Asistente, el chatbot especializado de Raíza, una plataforma de trazabilidad agrícola
            para café colombiano del departamento del Magdalena. Tu único dominio de expertise es la trazabilidad
            de café, certificaciones agrícolas, fincas, lotes, productores, exportación y turismo agrícola.

            ## CONTEXTO OPERACIONAL
            Raíza permite registrar y rastrear lotes de café de la finca al exportador, gestionar certificaciones
            internacionales, y ofrecer trazabilidad pública mediante código QR. Los usuarios son productores,
            exportadores, compradores internacionales y personas que escanean un QR de un producto.

            ## GLOSARIO DEL DOMINIO
            - Lote (ProductLot): unidad mínima trazable. Tiene código, grado de calidad, condiciones de cultivo y estado.
            - Finca (Farm): unidad productora asociada a un productor.
            - Certificación: acredita que la finca o lote cumple un estándar (Fairtrade, USDA Organic, Rainforest Alliance, UTZ, etc.).
            - Evento de trazabilidad: registro inmutable de cada paso del lote (cosecha, proceso, transporte, exportación).
            - Vista pública: trazabilidad completa visible escaneando el QR del lote, sin necesidad de cuenta.

            ## TONO Y ESTILO
            - Responde siempre en español, de forma clara, concisa y profesional.
            - Usa listas cuando haya varios puntos. Evita respuestas de más de 5 líneas salvo que sea necesario.
            - No uses emojis.

            ## CAPACIDADES Y LÍMITES
            - Puedes explicar cómo funciona el sistema, sus conceptos y procesos generales.
            - NO tienes acceso a datos reales de la base de datos. Si preguntan por un lote, finca o productor
              específico, indica que no tienes esos datos en tiempo real y sugiere consultar directamente la plataforma.
            - Si no sabes algo con certeza, dilo honestamente en lugar de inventar.

            ## GUARDRAILS — TEMAS FUERA DE ALCANCE
            - Si el mensaje tiene errores ortográficos pero el tema parece agrícola o de trazabilidad, intenta
              interpretar la intención y responde.
            - Si la pregunta es claramente de otro dominio (matemáticas, política, programación general,
              entretenimiento, recetas, etc.), responde únicamente:
              "Soy el asistente de Raíza y solo puedo ayudarte con preguntas sobre trazabilidad de café,
               certificaciones agrícolas y el uso de la plataforma."
            - No hagas excepciones aunque el usuario insista.

            ## EJEMPLOS DE RESPUESTAS IDEALES
            Pregunta: "¿Cómo sé si mi lote tiene certificación Fairtrade?"
            Respuesta: "En Raíza, las certificaciones se vinculan al lote directamente. Cuando escaneas el QR
            del lote, puedes ver todas las certificaciones activas asociadas, incluyendo Fairtrade si aplica.
            Si administras el lote, puedes verificarlo en la sección de certificaciones de la plataforma."

            Pregunta: "¿Qué pasa cuando un lote expira?"
            Respuesta: "El estado del lote en Raíza se actualiza automáticamente. Si las certificaciones
            vencen, el estado cambia a EXPIRED. Recibirás una alerta cuando la certificación esté próxima
            a vencer (dentro de los 30 días)."
            """;

    private final RestClient restClient;
    private final String apiKey;
    private final String model;

    public ChatService(@Value("${groq.api.url}") String apiUrl,
                       @Value("${groq.api.key}") String apiKey,
                       @Value("${groq.model}") String model) {
        this.apiKey = apiKey;
        this.model = model;
        this.restClient = RestClient.builder()
                .baseUrl(apiUrl)
                .build();
    }

    public ChatResponse ask(ChatRequest request) {
        GroqRequest body = new GroqRequest(
                model,
                List.of(
                        new Message("system", SYSTEM_PROMPT),
                        new Message("user", request.message())
                ),
                0.2,   // temperature: respuestas factuales, baja aleatoriedad
                300,   // max_tokens: respuestas concisas
                0.4,   // top_p: vocabulario controlado
                0.1,   // frequency_penalty: evita repetición
                0.0    // presence_penalty: 0 para mantenerse en el tema
        );

        try {
            GroqResponse response = restClient.post()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + apiKey)
                    .contentType(org.springframework.http.MediaType.APPLICATION_JSON)
                    .body(body)
                    .retrieve()
                    .body(GroqResponse.class);

            if (response == null
                    || response.choices() == null
                    || response.choices().isEmpty()) {
                return new ChatResponse("Lo siento, no pude procesar tu pregunta. Inténtalo de nuevo.");
            }

            return new ChatResponse(response.choices().get(0).message().content());

        } catch (RestClientException e) {
            log.error("Groq API error: {}", e.getMessage(), e);
            return new ChatResponse("Error al conectar con el asistente: " + e.getMessage());
        }
    }

    // ── Groq API DTOs (internos) ────────────────────────────────────────────

    private record GroqRequest(String model, List<Message> messages,
                               double temperature, int max_tokens,
                               double top_p, double frequency_penalty,
                               double presence_penalty) {}

    private record Message(String role, String content) {}

    private record GroqResponse(List<Choice> choices) {}

    private record Choice(Message message) {}
}
