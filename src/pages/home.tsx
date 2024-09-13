import './home.css';

import { ChangeEvent, useEffect, useState } from 'react';

import api from '../libs/api';

interface Profile {
  userId: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
}

function Home() {
  // 设置用户信息和编辑模式的状态
  const [profile, setProfile] = useState<Profile>({
    userId: '',
    username: '',
    fullName: '',
    email: '',
    phone: '',
  });
  const [originalProfile, setOriginalProfile] = useState<Profile>({
    userId: '',
    username: '',
    fullName: '',
    email: '',
    phone: '',
  });
  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [errors, setErrors] = useState<Partial<Profile>>({}); // 存储校验错误信息
  const [buttonDisabled, setButtonDisabled] = useState<boolean>(false);

  // 获取用户信息
  useEffect(() => {
    const fetchProfile = async () => {
      // 假设从后端获取用户数据
      const { data } = await api.get('/api/user');
      if (data.success) {
        setProfile(data.data);
        setOriginalProfile(data.data); // 保存初始的用户信息
      } else {
        setButtonDisabled(true);
        alert(`Message from api: ${data.message}`);
      }
    };

    fetchProfile();
  }, []);

  // 处理输入变更
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    // 只允许 phone 字段为数字
    if (name === 'phone') {
      const numericValue = value.replace(/\D/g, ''); // 移除非数字字符
      setProfile({
        ...profile,
        [name]: numericValue,
      });
    } else {
      setProfile({
        ...profile,
        [name]: value,
      });
    }
  };

  // 校验邮箱格式
  const validateEmail = (email: string) => {
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  // 校验手机号格式 (假设校验格式为10-12位数字)
  const validatePhone = (phone: string) => {
    const phoneRegex = /^((\+|00)86)?(1[3-9]|9[28])\d{9}$/;
    return phoneRegex.test(phone);
  };

  // 校验用户名是否为空
  const validateUsername = (username: string) => {
    return username !== undefined && username.trim().length > 0;
  };

  // 通用字段校验函数
  const validateField = (name: string, value: string) => {
    let error = '';
    if (name === 'email' && value) {
      if (!validateEmail(value)) {
        error = '邮箱格式错误';
      }
    } else if (name === 'phone' && value) {
      if (!validatePhone(value)) {
        error = '手机号格式错误';
      }
    } else if (name === 'username') {
      if (!validateUsername(value)) {
        error = '用户名不能为空';
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      [name]: error || undefined,
    }));
  };

  // 处理单个字段校验逻辑
  const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    validateField(name, value);
  };

  // 保存前对所有字段进行校验
  const validateAllFields = () => {
    const newErrors: Partial<Profile> = {};

    if (!validateUsername(profile.username)) {
      newErrors.username = '用户名不能为空';
    }

    if (profile.email && !validateEmail(profile.email)) {
      newErrors.email = '邮箱格式错误';
    }

    if (profile.phone && !validatePhone(profile.phone)) {
      newErrors.phone = '手机号格式错误';
    }

    setErrors(newErrors);

    // 如果没有错误，返回 true
    return Object.keys(newErrors).length === 0;
  };

  // 保存修改
  const handleSave = async () => {
    // 在保存之前校验所有字段
    if (validateAllFields()) {
      // 将数据发送到后端
      const { data } = await api.put('/api/user', profile);
      if (data.success) {
        setIsEditing(false);
        setOriginalProfile(profile); // 更新原始数据
      } else {
        alert(`Message from api: ${data.message}`);
      }
    }
  };

  // 撤销编辑
  const handleCancel = () => {
    setErrors({});
    setProfile(originalProfile);
    setIsEditing(false);
  };

  return (
    <div className="profile-container">
      <h2>{profile.fullName || '用户'} 您好，请完善您的个人信息：</h2>

      <div className="profile-form">
        <div className="profile-row">
          <p className="row-name">用户名*:</p>
          {isEditing ? (
            <input
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Username"
            />
          ) : (
            <span>{profile.username}</span>
          )}
          {/* 用户名提示 */}
          <p className="error-message">{errors.username}</p>
        </div>

        <div className="profile-row">
          <p className="row-name">邮箱:</p>
          {isEditing ? (
            <input
              type="email"
              name="email"
              value={profile.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Email"
            />
          ) : (
            <span>{profile.email}</span>
          )}
          {/* 邮箱错误提示 */}
          <p className="error-message">{errors.email}</p>
        </div>

        <div className="profile-row">
          <p className="row-name">手机号:</p>
          {isEditing ? (
            <input
              type="tel"
              name="phone"
              value={profile.phone}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Phone"
              pattern="[0-9]*"
              inputMode="numeric"
            />
          ) : (
            <span>{profile.phone}</span>
          )}
          {/* 手机号错误提示 */}
          <p className="error-message">{errors.phone}</p>
        </div>

        <div className="button-container">
          {isEditing ? (
            <div className="button-group">
              <button type="button" onClick={handleSave}>
                保存
              </button>
              <button type="button" onClick={handleCancel}>
                撤销
              </button>
            </div>
          ) : (
            <button type="button" onClick={() => setIsEditing(true)} disabled={buttonDisabled}>
              编辑
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Home;
