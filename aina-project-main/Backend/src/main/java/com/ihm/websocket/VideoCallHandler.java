package com.ihm.websocket;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.ihm.entites.Utilisateur;
import com.ihm.sec.JwtUtil;
import com.ihm.service.UserDetailsServiceImp;
import com.ihm.service.UtilisateurService;
import org.json.JSONObject;


import io.jsonwebtoken.Claims;
import io.jsonwebtoken.Jwts;
import io.jsonwebtoken.SignatureAlgorithm;


import java.io.IOException;
import java.util.concurrent.CopyOnWriteArrayList;


public class VideoCallHandler extends TextWebSocketHandler {

    @Autowired
    private UserDetailsServiceImp userDetailsServiceImp;
    
    @Autowired
    private UtilisateurService utilisateurService;
    
    @Autowired
    private JwtUtil jwtUtil;


    private final CopyOnWriteArrayList<WebSocketSession> sessions = new CopyOnWriteArrayList<>();

   
    @Override
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		sessions.add(session);

		String userId = extractUserIdFromSession(session); // Implémentez cette méthode pour extraire l'ID utilisateur
															// depuis la session

		if (userId != null) {
			Utilisateur user = userDetailsServiceImp.getUserDetailsById(Integer.parseInt(userId));

			session.getAttributes().put("user", user);
			utilisateurService.updateOnlineStatus(user.getIduser(), true); // Mettre à jour le statut en ligne
			System.out.println("le id est " + user.getIduser());
			
		} else {
			System.out.println("New WebSocket connection established: ");

		}

		System.out.println("New WebSocket connection established: " + session.getId());
	}

	private String extractUserIdFromSession(WebSocketSession session) {
		// Vérifiez que l'URI contient bien le paramètre iduser
		String query = session.getUri().getQuery();
		if (query != null && query.contains("iduser=")) {
			// Extraire l'ID utilisateur de l'URL
			String[] params = query.split("&");
			for (String param : params) {
				if (param.startsWith("iduser=")) {
					return param.split("=")[1];
				}
			}
		}
		return null;
	}
    
    
    
    @Override
    public void handleTextMessage(WebSocketSession session, TextMessage message) throws IOException {
        System.out.println("WebSocket message received: " + message.getPayload());
        String payload = message.getPayload();

        if (payload.contains("\"type\":\"decline\"")) {
            handleDeclineCall(session, payload);
        } else if (payload.contains("\"type\":\"accept\"")) {
            handleAcceptCall(session, payload);
        } else if (payload.contains("\"type\":\"offer\"")) {
            handleOffer(session, payload);
        } else if (payload.contains("\"type\":\"answer\"")) {
            handleAnswer(session, payload);
        } else if (payload.contains("\"type\":\"candidate\"")) {
            handleCandidate(session, payload);
        } else if (payload.contains("\"type\":\"hangup\"")) {
            handleHangupCall(session, payload);
        } else if (payload.contains("\"type\":\"ringing\"")) {
            handleRinging(session, payload);
        } else if (payload.contains("\"type\":\"invitation\"")){
        	
        	handleInvitCall(session, payload);
        	
        }
        else
        {
            broadcastMessage(session, message);
        }
    }

    private void broadcastMessage(WebSocketSession senderSession, TextMessage message) throws IOException {
        for (WebSocketSession session : sessions) {
            if (session.isOpen() && !session.getId().equals(senderSession.getId())) {
                session.sendMessage(message);
            }
        }
    }



    private void handleOffer(WebSocketSession session, String payload) throws IOException {
        String offer = extractJsonField(payload, "offer");
        String callerInfo = extractJsonField(payload, "callerInfo");
        
        if (offer != null && callerInfo != null) {
            // Assurez-vous de cibler uniquement l'utilisateur destinataire
            for (WebSocketSession wsSession : sessions) {
                if (wsSession.isOpen() && !wsSession.getId().equals(session.getId())) {
                    wsSession.sendMessage(new TextMessage("{\"type\":\"offer\", \"offer\":" + offer + ", \"callerInfo\":" + callerInfo + "}"));
                }
            }
        } else {
            System.err.println("Offer or callerInfo is null, skipping message broadcast.");
        }
    }


    private String extractJsonField(String json, String fieldName) {
        try {
            JSONObject jsonObject = new JSONObject(json);
            return jsonObject.getString(fieldName);
        } catch (Exception e) {
            System.err.println("Failed to extract field: " + fieldName + " from JSON: " + json);
            e.printStackTrace();
            return null;
        }
    }


    private void handleAnswer(WebSocketSession session, String payload) throws IOException {
        System.out.println("Handling answer from session: " + session.getId());
        broadcastMessage(session, new TextMessage(payload));
    }

    private void handleCandidate(WebSocketSession session, String payload) throws IOException {
        System.out.println("Handling candidate from session: " + session.getId());
        broadcastMessage(session, new TextMessage(payload));
    }

    private void handleAcceptCall(WebSocketSession session, String payload) throws IOException {
        System.out.println("Call accepted by session: " + session.getId());
        broadcastMessage(session, new TextMessage(payload));
    }

    private void handleDeclineCall(WebSocketSession session, String payload) throws IOException {
        System.out.println("Call declined by session: " + session.getId());
        broadcastMessage(session, new TextMessage(payload));
    }

    private void handleHangupCall(WebSocketSession session, String payload) throws IOException {
        System.out.println("Call hung up by session: " + session.getId());
        
        
         JSONObject jsonPayload = new JSONObject(payload);
        
        // Accéder à la valeur de "nom"
        String nomUser = jsonPayload.optString("nom"); // Utilisez optString pour éviter les exceptions si "nom" n'existe pas
       
        String typeevent="hangup";
        
     
        		
       // Formatez le payload pour inclure la categorie d'appel
        //String updatedPayload = "{ \"type\": \""+ typeevent+ "\",\"nom\":\""+nomUser+"\",\"sessionId\": \"" + session.getId() + "\", \"isGroupCall\": " + isGroupCall() + " }";
        
      broadcastMessage(session, new TextMessage(payload));
      //broadcastMessage(session, new TextMessage(updatedPayload));
    }

    private void handleRinging(WebSocketSession session, String payload) throws IOException {
        System.out.println("Call ringing for session: " + session.getId());
        broadcastMessage(session, new TextMessage(payload));
    }

    
    private void handleInvitCall(WebSocketSession session, String payload) throws IOException {
        System.out.println("Invit call  for session: " + session.getId());
        
        broadcastMessage(session, new TextMessage(payload));
    }
    
    
    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
        sessions.remove(session);
        System.out.println("WebSocket connection closed: " + session.getId());
    }

    @Override
    public void handleTransportError(WebSocketSession session, Throwable exception) throws Exception {
        System.out.println("WebSocket transport error: " + exception.getMessage());
        exception.printStackTrace();
    }

    private String extractCallerIdFromPayload(String payload) {
        try {
            return payload.split("\"callerId\":\"")[1].split("\"")[0];
        } catch (Exception e) {
            System.err.println("Failed to extract caller ID: " + e.getMessage());
            return null;
        }
    }
    
 // Méthode pour déterminer si l'appel est un appel de groupe
    private boolean isGroupCall() {
        return sessions.size() > 2; // Adaptez selon la logique de votre application
    }

}
