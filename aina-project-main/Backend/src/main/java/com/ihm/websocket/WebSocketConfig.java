package com.ihm.websocket;



import com.ihm.websocket.VideoCallHandler;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(videoCallHandler(), "/video-call").setAllowedOrigins("*");
    }

    @Bean
    public VideoCallHandler videoCallHandler() {
        return new VideoCallHandler();
    }
}

