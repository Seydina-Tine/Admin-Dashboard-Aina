package com.ihm.web;



import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.ihm.entites.Permission;
import com.ihm.service.PermissionService;

@RestController
@RequestMapping("/permissions")
public class PermissionController {

    @Autowired
    private PermissionService permissionService;

    @GetMapping("/{beneficiaireId}")
    public List<Permission> getPermissions(@PathVariable Long beneficiaireId) {
        return permissionService.getPermissionsByBeneficiaireId(beneficiaireId);
    }

    @PutMapping("/{id}")
    public Permission updatePermission(@PathVariable Long id, @RequestBody Permission permission) {
        return permissionService.updatePermission(id, permission);
    }
}

