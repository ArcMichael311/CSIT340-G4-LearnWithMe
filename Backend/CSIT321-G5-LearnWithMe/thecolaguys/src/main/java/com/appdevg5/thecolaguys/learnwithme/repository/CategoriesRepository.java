package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoriesEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface CategoriesRepository extends JpaRepository<CategoriesEntity, Long> {

	// Example finder methods you can use without implementing
	List<CategoriesEntity> findByName(String name);

	List<CategoriesEntity> findByNameContainingIgnoreCase(String fragment);

}

