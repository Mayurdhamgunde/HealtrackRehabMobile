import React, {useState} from 'react';
import {
  ActivityIndicator,
  Alert,
  Dimensions,
  Image,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import AuthIcon from '@/components/common/AuthIcon';
import {useAppDispatch} from '@/app/store/hooks';
import {signedIn} from '@/app/store/sessionSlice';
import {
  login,
  requestOtp,
  resetPasswordWithOtp,
  verifyOtpLogin,
} from '../api/authRepository';

const {width} = Dimensions.get('window');

export default function LoginScreen() {
  const dispatch = useAppDispatch();

  // Toggle between 'login' and 'forgot' views (exact HealTrackPro architecture)
  const [currentView, setCurrentView] = useState<'login' | 'forgot'>('login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [otp, setOtp] = useState('');
  const [isOtpSent, setIsOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isPasswordLogin, setIsPasswordLogin] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  // Forgot password form states
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isForgotOtpSent, setIsForgotOtpSent] = useState(false);
  const [forgotPasswordVisible, setForgotPasswordVisible] = useState(false);
  const [forgotConfirmVisible, setForgotConfirmVisible] = useState(false);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const isValidEmail = (val: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(val);
  };

  /* ── Password Login ── */
  const loginWithPassword = async () => {
    const lowerCaseEmail = email.toLowerCase().trim();
    if (!isValidEmail(lowerCaseEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!password || password.length < 6) {
      Alert.alert('Invalid Password', 'Please enter a valid password.');
      return;
    }

    setLoading(true);
    try {
      const user = await login({email: lowerCaseEmail, password});
      dispatch(signedIn(user));
    } catch (error) {
      console.error('Error logging in:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  /* ── Send OTP ── */
  const sendOtp = async () => {
    const lowerCaseEmail = email.toLowerCase().trim();
    if (!isValidEmail(lowerCaseEmail)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    setLoading(true);
    try {
      const msg = await requestOtp(lowerCaseEmail);
      setIsOtpSent(true);
      Alert.alert('Success', msg || `OTP sent successfully to ${lowerCaseEmail}.`);
    } catch (error) {
      console.error('Error sending OTP:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP');
    } finally {
      setLoading(false);
    }
  };

  /* ── Verify OTP ── */
  const verifyOtp = async () => {
    const lowerCaseEmail = email.toLowerCase().trim();
    if (!otp || otp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const user = await verifyOtpLogin(lowerCaseEmail, otp);
      dispatch(signedIn(user));
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to verify OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setIsOtpSent(false);
    setOtp('');
    setPassword('');
    setIsPasswordLogin(false);
  };

  const toggleLoginMethod = () => {
    setIsPasswordLogin(!isPasswordLogin);
    setIsOtpSent(false);
    setOtp('');
  };

  /* ── Create Account Dialog (exact HealTrackPro behavior) ── */
  const handleCreateAccount = () => {
    Alert.alert(
      'Create an Account',
      'How would you like to register?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Register as Clinic',
          onPress: () => {
            Alert.alert('Registration', 'Clinic registration is available in the web portal.');
          },
        },
        {
          text: 'Register as Doctor',
          onPress: () => {
            Alert.alert('Registration', 'Doctor registration is available in the web portal.');
          },
        },
      ],
      {cancelable: true},
    );
  };

  /* ── Forgot Password Handlers ── */
  const handleForgotSendOtp = async () => {
    const lower = forgotEmail.toLowerCase().trim();
    if (!isValidEmail(lower)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }
    setLoading(true);
    try {
      const msg = await requestOtp(lower);
      setIsForgotOtpSent(true);
      Alert.alert('Success', msg || 'OTP has been sent to your email.');
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleForgotResetPassword = async () => {
    if (forgotOtp.length !== 6) {
      Alert.alert('Invalid OTP', 'Please enter a valid 6-digit OTP.');
      return;
    }
    if (!newPassword || newPassword.length < 6) {
      Alert.alert('Invalid Password', 'Please enter a valid password (at least 6 characters).');
      return;
    }
    if (newPassword !== confirmPassword) {
      Alert.alert('Password Mismatch', 'Passwords do not match.');
      return;
    }
    setLoading(true);
    try {
      const msg = await resetPasswordWithOtp(forgotEmail, forgotOtp, newPassword);
      Alert.alert('Success', msg || 'Your password has been updated.', [
        {
          text: 'OK',
          onPress: () => {
            setCurrentView('login');
            setIsForgotOtpSent(false);
            setForgotOtp('');
            setNewPassword('');
            setConfirmPassword('');
          },
        },
      ]);
    } catch (error) {
      Alert.alert('Error', error instanceof Error ? error.message : 'Failed to reset password. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <ImageBackground
      source={require('@/assets/healtrack-bg.png')}
      style={styles.backgroundImage}
      resizeMode="cover">
      <StatusBar
        barStyle="light-content"
        {...({backgroundColor: 'transparent', translucent: true} as any)}
      />

      <SafeAreaView style={styles.safeArea} edges={['top', 'bottom']}>
        <KeyboardAvoidingView
          style={styles.container}
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
          <ScrollView
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled"
            scrollEnabled={true}
            nestedScrollEnabled={true}>
          {currentView === 'login' ? (
            /* ─────────────────────────────────────────────────────────────
               LOGIN CARD (Exact HealTrackPro Dark Card Design & Alignment)
               ───────────────────────────────────────────────────────────── */
            <View style={styles.cardContent}>
              <View style={styles.headerSection}>
                <Image
                  source={require('@/assets/healtrack_logo2.png')}
                  style={styles.logo}
                  resizeMode="contain"
                />
              </View>

              <View style={styles.formSection}>
                <Text style={styles.title}>
                  {isPasswordLogin
                    ? 'Password Login'
                    : !isOtpSent
                    ? 'OTP Login'
                    : 'Verify OTP'}
                </Text>
                <Text style={styles.subtitle}>
                  {isPasswordLogin
                    ? 'Login with your email and password'
                    : !isOtpSent
                    ? 'Login with your email address'
                    : `Enter the verification code sent to ${email}`}
                </Text>

                {/* Email Input */}
                {!isOtpSent && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                      <AuthIcon name="email" size={20} color="#007b8e" />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter email address"
                        placeholderTextColor="#888888"
                        value={email}
                        onChangeText={text => setEmail(text.toLowerCase())}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                  </View>
                )}

                {/* Password Input */}
                {isPasswordLogin && !isOtpSent && (
                  <>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputContainer}>
                        <AuthIcon name="lock" size={20} color="#007b8e" />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter password"
                          placeholderTextColor="#888888"
                          value={password}
                          onChangeText={setPassword}
                          secureTextEntry={!isPasswordVisible}
                          editable={!loading}
                          returnKeyType="done"
                          onSubmitEditing={loginWithPassword}
                        />
                        <TouchableOpacity
                          onPress={togglePasswordVisibility}
                          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                          activeOpacity={0.7}
                          style={styles.eyeButton}>
                          <AuthIcon
                            name={isPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#007b8e"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.forgotPasswordButton}
                      onPress={() => setCurrentView('forgot')}
                      disabled={loading}>
                      <Text style={styles.forgotPasswordText}>
                        Forgot Password?
                      </Text>
                    </TouchableOpacity>
                  </>
                )}

                {/* OTP Input */}
                {isOtpSent && !isPasswordLogin && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                      <AuthIcon name="lock" size={20} color="#007b8e" />
                      <TextInput
                        style={styles.input}
                        placeholder="Enter 6-digit code"
                        placeholderTextColor="#888888"
                        value={otp}
                        onChangeText={setOtp}
                        keyboardType="numeric"
                        maxLength={6}
                        editable={!loading}
                        returnKeyType="done"
                        onSubmitEditing={verifyOtp}
                      />
                    </View>
                  </View>
                )}

                {/* Main Action Button */}
                <TouchableOpacity
                  style={[
                    styles.mainButton,
                    loading && styles.mainButtonDisabled,
                  ]}
                  onPress={
                    isPasswordLogin
                      ? loginWithPassword
                      : !isOtpSent
                      ? sendOtp
                      : verifyOtp
                  }
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.mainButtonText}>
                      {isPasswordLogin
                        ? 'Login'
                        : !isOtpSent
                        ? 'Send OTP'
                        : 'Verify & Login'}
                    </Text>
                  )}
                </TouchableOpacity>

                {/* Switch Login Method */}
                {!isOtpSent && (
                  <TouchableOpacity
                    style={styles.switchButton}
                    onPress={toggleLoginMethod}
                    disabled={loading}>
                    <Text style={styles.switchButtonText}>
                      {isPasswordLogin ? 'Use OTP Login' : 'Use Password Login'}
                    </Text>
                  </TouchableOpacity>
                )}

                {/* OTP Links */}
                {isOtpSent && !isPasswordLogin && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={resetForm}
                      disabled={loading}>
                      <AuthIcon name="arrow-left" size={16} color="#007b8e" />
                      <Text style={styles.linkButtonText}>Change Email</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={styles.linkButton}
                      onPress={sendOtp}
                      disabled={loading}>
                      <AuthIcon name="refresh" size={16} color="#007b8e" />
                      <Text style={styles.linkButtonText}>Resend Code</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Create Account Section */}
                <View style={styles.createAccountContainer}>
                  <Text style={styles.createAccountText}>
                    Don't have an account?{' '}
                  </Text>
                  <TouchableOpacity
                    onPress={handleCreateAccount}
                    disabled={loading}>
                    <Text style={styles.createAccountLink}>
                      Create an account
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ) : (
            /* ─────────────────────────────────────────────────────────────
               FORGOT PASSWORD CARD (Exact HealTrackPro Dark Card Design)
               ───────────────────────────────────────────────────────────── */
            <View style={styles.cardContent}>
              <View style={styles.forgotHeaderSection}>
                <TouchableOpacity
                  style={styles.closeButton}
                  onPress={() => setCurrentView('login')}
                  disabled={loading}>
                  <AuthIcon name="close" size={20} color="#8E8E8E" />
                </TouchableOpacity>
              </View>

              <View style={styles.formSection}>
                <Text style={styles.title}>Forgot Password</Text>
                <Text style={styles.subtitle}>
                  {isForgotOtpSent
                    ? 'Enter the OTP sent to your email along with your new password.'
                    : 'Enter your email to receive an OTP.'}
                </Text>

                {/* Email Input */}
                {!isForgotOtpSent && (
                  <View style={styles.inputWrapper}>
                    <View style={styles.inputContainer}>
                      <AuthIcon name="email" size={20} color="#007b8e" />
                      <TextInput
                        style={styles.input}
                        placeholder="Email"
                        placeholderTextColor="#888888"
                        value={forgotEmail}
                        onChangeText={text => setForgotEmail(text.toLowerCase())}
                        keyboardType="email-address"
                        autoCapitalize="none"
                        editable={!loading}
                        returnKeyType="next"
                      />
                    </View>
                  </View>
                )}

                {isForgotOtpSent && (
                  <>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputContainer}>
                        <AuthIcon name="shield-key" size={20} color="#007b8e" />
                        <TextInput
                          style={styles.input}
                          placeholder="Enter 6-digit OTP"
                          placeholderTextColor="#888888"
                          value={forgotOtp}
                          onChangeText={setForgotOtp}
                          keyboardType="numeric"
                          maxLength={6}
                          editable={!loading}
                          returnKeyType="next"
                        />
                      </View>
                    </View>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputContainer}>
                        <AuthIcon name="lock" size={20} color="#007b8e" />
                        <TextInput
                          style={styles.input}
                          placeholder="New Password"
                          placeholderTextColor="#888888"
                          value={newPassword}
                          onChangeText={setNewPassword}
                          secureTextEntry={!forgotPasswordVisible}
                          editable={!loading}
                          returnKeyType="next"
                        />
                        <TouchableOpacity
                          onPress={() => setForgotPasswordVisible(!forgotPasswordVisible)}
                          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                          activeOpacity={0.7}
                          style={styles.eyeButton}
                          disabled={loading}>
                          <AuthIcon
                            name={forgotPasswordVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#007b8e"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                    <View style={styles.inputWrapper}>
                      <View style={styles.inputContainer}>
                        <AuthIcon name="lock-check" size={20} color="#007b8e" />
                        <TextInput
                          style={styles.input}
                          placeholder="Re-enter Password"
                          placeholderTextColor="#888888"
                          value={confirmPassword}
                          onChangeText={setConfirmPassword}
                          secureTextEntry={!forgotConfirmVisible}
                          editable={!loading}
                          returnKeyType="done"
                          onSubmitEditing={handleForgotResetPassword}
                        />
                        <TouchableOpacity
                          onPress={() => setForgotConfirmVisible(!forgotConfirmVisible)}
                          hitSlop={{top: 12, bottom: 12, left: 12, right: 12}}
                          activeOpacity={0.7}
                          style={styles.eyeButton}
                          disabled={loading}>
                          <AuthIcon
                            name={forgotConfirmVisible ? 'eye-off' : 'eye'}
                            size={20}
                            color="#007b8e"
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  </>
                )}

                <TouchableOpacity
                  style={[
                    styles.mainButton,
                    loading && styles.mainButtonDisabled,
                  ]}
                  onPress={
                    isForgotOtpSent ? handleForgotResetPassword : handleForgotSendOtp
                  }
                  disabled={loading}>
                  {loading ? (
                    <ActivityIndicator size="small" color="#fff" />
                  ) : (
                    <Text style={styles.mainButtonText}>
                      {isForgotOtpSent ? 'Set New Password' : 'Send OTP'}
                    </Text>
                  )}
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.switchButton}
                  onPress={() => setCurrentView('login')}
                  disabled={loading}>
                  <Text style={styles.switchButtonText}>Back to Login</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  </ImageBackground>
);
}

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    backgroundColor: '#05181D',
  },
  safeArea: {
    flex: 1,
  },
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 28,
    paddingHorizontal: 16,
  },
  cardContent: {
    width: '92%',
    maxWidth: 390,
    borderRadius: 24,
    overflow: 'hidden',
    backgroundColor: '#1E1E1E',
    elevation: 10,
    shadowColor: '#000000',
    shadowOffset: {width: 0, height: 6},
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  headerSection: {
    marginTop: 40,
    alignItems: 'center',
    position: 'relative',
  },
  forgotHeaderSection: {
    alignItems: 'flex-end',
    paddingTop: 12,
    paddingRight: 12,
  },
  closeButton: {
    padding: 8,
  },
  logo: {
    width: width * 0.48,
    height: 64,
  },
  formSection: {
    paddingHorizontal: 20,
    paddingTop: 36,
    paddingBottom: 28,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 14,
    color: '#8E8E8E',
    marginBottom: 24,
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: '#383838',
    borderRadius: 12,
    paddingHorizontal: 16,
    height: 52,
    backgroundColor: '#383838',
  },
  input: {
    flex: 1,
    marginLeft: 12,
    fontSize: 15,
    color: '#FFFFFF',
  },
  eyeButton: {
    padding: 4,
    alignItems: 'center',
    justifyContent: 'center',
  },
  forgotPasswordButton: {
    alignSelf: 'flex-end',
    marginTop: -10,
    marginBottom: 18,
    paddingHorizontal: 4,
  },
  forgotPasswordText: {
    color: '#007b8e',
    fontSize: 14,
    fontWeight: '500',
  },
  mainButton: {
    backgroundColor: '#007b8e',
    height: 52,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
  },
  mainButtonDisabled: {
    opacity: 0.6,
  },
  mainButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  switchButton: {
    marginTop: 16,
    paddingVertical: 8,
    alignItems: 'center',
  },
  switchButtonText: {
    color: '#007b8e',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  linkButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  linkButtonText: {
    color: '#007b8e',
    marginLeft: 6,
    fontSize: 14,
    fontWeight: '600',
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 22,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#2E2E2E',
  },
  createAccountText: {
    color: '#8E8E8E',
    fontSize: 14,
  },
  createAccountLink: {
    color: '#007b8e',
    fontSize: 14,
    fontWeight: 'bold',
  },
});
