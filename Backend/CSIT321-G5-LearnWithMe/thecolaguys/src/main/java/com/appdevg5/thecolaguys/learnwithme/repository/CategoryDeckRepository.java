package com.appdevg5.thecolaguys.learnwithme.repository;

import com.appdevg5.thecolaguys.learnwithme.entity.CategoryDeckEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Repository
public interface CategoryDeckRepository extends JpaRepository<CategoryDeckEntity, Long> {

	List<CategoryDeckEntity> findByCategoryId(Long categoryId);

	List<CategoryDeckEntity> findByDeckId(Long deckId);

	@Modifying
	@Transactional
	@Query("DELETE FROM CategoryDeckEntity c WHERE c.categoryId = :categoryId")
	void deleteByCategoryId(Long categoryId);

	@Modifying
	@Transactional
	@Query("DELETE FROM CategoryDeckEntity c WHERE c.deckId = :deckId")
	void deleteByDeckId(Long deckId);
}
