package com.dj.dao;

import com.dj.model.User;


public interface UserDao {
    int deleteById(Long id);

    int insertAll(User record);

    int insert(User record);

    User getById(Long id);

    int updateBy(User record);

    int updateByIdAll(User record);
}