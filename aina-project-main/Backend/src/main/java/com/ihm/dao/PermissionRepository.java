package com.ihm.dao;



import java.util.List;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import com.ihm.entites.Permission;

@Repository
public interface PermissionRepository extends JpaRepository<Permission, Long> {
    List<Permission> findByBeneficiaireId(Long beneficiaireId);
}
