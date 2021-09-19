package ir.piana.business.isms.module.data.service;

import ir.piana.business.isms.module.data.entity.CategoryEntity;
import ir.piana.business.isms.module.data.repository.CategoryRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

import java.util.List;

@Component
public class CategoryService {
    @Autowired
    private CategoryRepository categoryRepository;

    public List<CategoryEntity> getCategories() {
        List<CategoryEntity> allOrderByIdAsc = categoryRepository.findAllOrderByIdAsc();
        return allOrderByIdAsc;
    }
}
