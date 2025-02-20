import { useState } from 'react';
import { View, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { TextInput, Button, Text, HelperText } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import CountryPicker from 'react-native-country-picker-modal';

const LoginPage = () => {
    const router = useRouter();
    const handleSignup = () => {
        router.push("/signup/createAccount")
      }
    const [isPhoneSelected, setIsPhoneSelected] = useState(true);
    const [country, setCountry] = useState({ callingCode: ['92'], cca2: 'PK' });
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            phoneNumber: '',
            email: '',
            password: '',
        },
    });

    const onSubmit = (data) => {
        if (isPhoneSelected) {
            // Handle phone number verification
            console.log('Phone:', `+${country.callingCode[0]}${data.phoneNumber}`);
            router.push('/otp-verification');
        } else {
            // Handle email login
            console.log('Email login:', data);
            router.push('/home');
        }
    };

    return (
        <LinearGradient colors={['#007AFF', '#0051A3']} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Login Account</Text>
                <Text style={styles.subtitle}>Hello, welcome back to your account</Text>

                <View style={styles.toggleContainer}>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            isPhoneSelected && styles.toggleButtonActive,
                        ]}
                        onPress={() => setIsPhoneSelected(true)}
                    >
                        <Text style={[
                            styles.toggleText,
                            isPhoneSelected && styles.toggleTextActive,
                        ]}>Phone Number</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[
                            styles.toggleButton,
                            !isPhoneSelected && styles.toggleButtonActive,
                        ]}
                        onPress={() => setIsPhoneSelected(false)}
                    >
                        <Text style={[
                            styles.toggleText,
                            !isPhoneSelected && styles.toggleTextActive,
                        ]}>Email</Text>
                    </TouchableOpacity>
                </View>

                {isPhoneSelected ? (
                    <View style={styles.phoneInputContainer}>
                        <TouchableOpacity style={styles.countryPicker}>
                            <CountryPicker
                                countryCode={country.cca2}
                                withFilter
                                withFlag
                                withCallingCode
                                withCountryNameButton={false}
                                onSelect={(selectedCountry) => setCountry(selectedCountry)}
                                containerButtonStyle={styles.countryPickerButton}
                            />
                            <Text style={styles.countryCode}>+{country.callingCode[0]}</Text>
                        </TouchableOpacity>
                        <Controller
                            control={control}
                            rules={{
                                required: 'Phone number is required',
                                pattern: {
                                    value: /^[0-9]+$/,
                                    message: 'Please enter a valid phone number',
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Phone Number"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="phone-pad"
                                    style={styles.phoneInput}
                                    error={!!errors.phoneNumber}
                                />
                            )}
                            name="phoneNumber"
                        />
                    </View>
                ) : (
                    <>
                        <Controller
                            control={control}
                            rules={{
                                required: 'Email is required',
                                pattern: {
                                    value: /^\S+@\S+$/i,
                                    message: 'Please enter a valid email',
                                },
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Email"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    keyboardType="email-address"
                                    style={styles.input}
                                    error={!!errors.email}
                                />
                            )}
                            name="email"
                        />
                        <Controller
                            control={control}
                            rules={{
                                required: 'Password is required',
                            }}
                            render={({ field: { onChange, onBlur, value } }) => (
                                <TextInput
                                    label="Password"
                                    onBlur={onBlur}
                                    onChangeText={onChange}
                                    value={value}
                                    secureTextEntry={!isPasswordVisible}
                                    right={
                                        <TextInput.Icon
                                            icon={isPasswordVisible ? 'eye-off' : 'eye'}
                                            onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                        />
                                    }
                                    style={styles.input}
                                    error={!!errors.password}
                                />
                            )}
                            name="password"
                        />
                    </>
                )}

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={styles.button}
                >
                    {isPhoneSelected ? 'Request OTP' : 'Login'}
                </Button>

                <View style={styles.dividerContainer}>
                    <View style={styles.divider} />
                    <Text style={styles.dividerText}>OR</Text>
                    <View style={styles.divider} />
                </View>

                <Text style={styles.signUpText}>
                    Not Registered yet?{' '}
                    <Text
                        style={styles.link}
                        onPress={handleSignup}
                    >
                        Create an Account
                    </Text>
                </Text>
            </ScrollView>
        </LinearGradient>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        color: 'white',
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: '#e0e0e0',
        marginBottom: 24,
    },
    toggleContainer: {
        flexDirection: 'row',
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        borderRadius: 10,
        padding: 4,
        marginBottom: 24,
    },
    toggleButton: {
        flex: 1,
        padding: 12,
        borderRadius: 8,
        alignItems: 'center',
    },
    toggleButtonActive: {
        backgroundColor: 'white',
    },
    toggleText: {
        color: '#e0e0e0',
        fontWeight: '600',
    },
    toggleTextActive: {
        color: '#007AFF',
    },
    phoneInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    countryPicker: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 8,
        borderRadius: 4,
        marginRight: 8,
    },
    countryPickerButton: {
        marginRight: 4,
    },
    countryCode: {
        color: '#000',
        fontSize: 16,
    },
    phoneInput: {
        flex: 1,
        backgroundColor: 'white',
    },
    input: {
        marginBottom: 12,
        backgroundColor: 'white',
    },
    button: {
        marginTop: 24,
        marginBottom: 16,
        paddingVertical: 8,
        backgroundColor: '#000',
    },
    dividerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginVertical: 24,
    },
    divider: {
        flex: 1,
        height: 1,
        backgroundColor: '#e0e0e0',
    },
    dividerText: {
        color: '#e0e0e0',
        paddingHorizontal: 16,
        fontSize: 16,
        fontWeight: 'bold',
    },
    signUpText: {
        textAlign: 'center',
        color: '#e0e0e0',
        marginTop: 16,
    },
    link: {
        color: '#FFD700',
    },
});

export default LoginPage;