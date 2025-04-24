package com.ihm.service;



import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.ihm.entites.Permission;
import com.ihm.dao.PermissionRepository;

@Service
public class PermissionService {

    @Autowired
    private PermissionRepository permissionRepository;

    public List<Permission> getPermissionsByBeneficiaireId(Long beneficiaireId) {
        return permissionRepository.findByBeneficiaireId(beneficiaireId);
    }

    public Permission updatePermission(Long id, Permission permission) {
        Permission existingPermission = permissionRepository.findById(id).orElseThrow();
        existingPermission.setEnabled(permission.isEnabled());
        return permissionRepository.save(existingPermission);
    }
}

