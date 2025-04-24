package com.ihm.web;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.ihm.entites.TransportAdapte;
import com.ihm.service.TransportAdapteService;

@RestController
@RequestMapping("/api/TransportAdapte")
public class TranportAdapteController {
	
	@Autowired
	private TransportAdapteService transportAdapteService;
	
	
	@PostMapping("/add")
	public ResponseEntity<TransportAdapte> AddTransportAdapte(@RequestBody TransportAdapte transport) {
		
		
		
		TransportAdapte newtransport= transportAdapteService.AddTransportAdapte(transport);
		
		return ResponseEntity.ok(newtransport);
		
	}

	@GetMapping()
	public ResponseEntity< List<TransportAdapte>> getTransportAdapte(@RequestParam(required=false) Long contactId, Long userBeneficiaire){
		
		List<TransportAdapte> transports;
		
		if (contactId!= null) {
		
		transports= transportAdapteService.getTransportAdapteByuser(contactId, userBeneficiaire);
		
	}else {
		transports= transportAdapteService.getTransportAdapteByuserbeneficiaire(userBeneficiaire);
	}
		
		return ResponseEntity.ok(transports);
 }
	
	@DeleteMapping("/{id}")
	public ResponseEntity<Void> removeTransportAdapte( @PathVariable Long id){ 
		
		transportAdapteService.deleteTransportAdapte(id);
		
			return ResponseEntity.noContent().build();
	}	
	
	@PutMapping("/{id}")
	public ResponseEntity <TransportAdapte> EditTransportAdapte(@PathVariable Long id, @RequestBody TransportAdapte transport){
		
		
		TransportAdapte newtransport= transportAdapteService.updateTransportAdapte(id, transport);
		
			return ResponseEntity.ok(newtransport);
		
		
	}
}	
