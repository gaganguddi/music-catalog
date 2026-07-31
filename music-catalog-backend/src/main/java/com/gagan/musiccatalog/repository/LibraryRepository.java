package com.gagan.musiccatalog.repository;

import com.gagan.musiccatalog.entity.Library;
import com.gagan.musiccatalog.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

import java.util.List;

public interface LibraryRepository extends JpaRepository<Library, Long> {

    List<Library> findByUser(User user);
    Optional<Library> findByIdAndUser(Long id, User user);
    boolean existsByUserAndAppleCatalogId(User user, Long appleCatalogId);
}