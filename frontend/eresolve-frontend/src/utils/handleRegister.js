const handleRegister = async () => {
  setShowError(false);

  if (!name || !email || !password || !confirmPassword) {
    showErrorMessage('Please fill all fields.');
    return;
  }

  if (password !== confirmPassword) {
    showErrorMessage('Passwords do not match.');
    return;
  }

  if (password.length < 6) {
    showErrorMessage('Password must be at least 6 characters long.');
    return;
  }

  setIsLoading(true);

  try {
    await register({
      name,
      email,
      password,
      role: 'USER'
    });

    alert('Registration successful! Please login.');

    setName('');
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  } catch (err) {
    showErrorMessage('Registration failed. Try a different email.');
  } finally {
    setIsLoading(false);
  }
};