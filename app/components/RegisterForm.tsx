"use client";

import React, { useState } from 'react';

const RegisterForm: React.FC = () => {
  const [name, setName] = useState('');
  const [affiliation, setAffiliation] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [title, setTitle] = useState('');
  const [privacyPolicyAgreed, setPrivacyPolicyAgreed] = useState(false);
  const [message, setMessage] = useState('');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name,
          affiliation,
          email,
          phone,
          title,
          privacy_policy_agreed: privacyPolicyAgreed,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(data.message);
      } else {
        setMessage(data.error);
      }
    } catch (error) {
      setMessage('登録に失敗しました。');
    }
  };

  return (
    <div>
      <h1>参加登録</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name">氏名 (必須):</label>
          <input
            type="text"
            id="name"
            name="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="affiliation">所属 (必須):</label>
          <input
            type="text"
            id="affiliation"
            name="affiliation"
            value={affiliation}
            onChange={(e) => setAffiliation(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="email">メールアドレス (必須):</label>
          <input
            type="email"
            id="email"
            name="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="phone">電話番号:</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="title">役職:</label>
          <input
            type="text"
            id="title"
            name="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        <div>
          <label htmlFor="privacy_policy_agreed">プライバシーポリシーに同意する (必須):</label>
          <input
            type="checkbox"
            id="privacy_policy_agreed"
            name="privacy_policy_agreed"
            checked={privacyPolicyAgreed}
            onChange={(e) => setPrivacyPolicyAgreed(e.target.checked)}
            required
          />
        </div>
        <button type="submit">登録</button>
      </form>
      {message && <p>{message}</p>}
    </div>
  );
};

export default RegisterForm;
