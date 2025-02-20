"use client"

import { useState } from "react"
import { View, StyleSheet, ScrollView } from "react-native"
import { TextInput, Button, Text, Checkbox, HelperText } from "react-native-paper"
import { useForm, Controller } from "react-hook-form"
import { useNavigation } from "@react-navigation/native"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"
import { colors } from "../../constants/Colors"
import { auth } from "../../firebaseConfig" // Import auth from your Firebase config
import { createUserWithEmailAndPassword } from "firebase/auth"
import { getFirestore, doc, setDoc } from "firebase/firestore"

const SignUpScreen = () => {
    const router = useRouter()
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)
    const [isChecked, setIsChecked] = useState(false)
    const navigation = useNavigation()

    const {
        control,
        handleSubmit,
        formState: { errors },
    } = useForm({
        defaultValues: {
            fullName: "",
            phoneNumber: "",
            email: "",
            password: "",
        },
    })

    const onSubmit = async (data) => {
        try {
            // Create user account
            const userCredential = await createUserWithEmailAndPassword(auth, data.email, data.password)
            const user = userCredential.user

            // Save additional user data to Firestore
            const db = getFirestore()
            await setDoc(doc(db, "users", user.uid), {
                fullName: data.fullName,
                phoneNumber: data.phoneNumber,
                email: data.email,
            })

            console.log("User account created & signed in!")
            router.push("phone/otp")
        } catch (error) {
            console.error("Error creating user account:", error)
            // Handle errors here, such as displaying error messages to the user
        }
    }

    const handleSignin = () => {
        router.push("/signup/login")
    }

    return (
        <LinearGradient colors={["#007AFF", "#0051A3"]} style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollView}>
                <Text style={styles.title}>Create an account</Text>
                <Text style={styles.subtitle}>Complete the sign up process to get started</Text>

                <Controller
                    control={control}
                    rules={{ required: "Full name is required" }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Full Name"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            style={styles.input}
                            error={!!errors.fullName}
                        />
                    )}
                    name="fullName"
                />
                {errors.fullName && <HelperText type="error">{errors.fullName.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: "Phone number is required",
                        pattern: { value: /^[0-9]+$/, message: "Please enter a valid phone number" },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Phone Number"
                            onBlur={onBlur}
                            onChangeText={onChange}
                            value={value}
                            keyboardType="phone-pad"
                            style={styles.input}
                            error={!!errors.phoneNumber}
                        />
                    )}
                    name="phoneNumber"
                />
                {errors.phoneNumber && <HelperText type="error">{errors.phoneNumber.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: "Email is required",
                        pattern: { value: /^\S+@\S+$/i, message: "Please enter a valid email" },
                    }}
                    render={({ field: { onChange, onBlur, value } }) => (
                        <TextInput
                            label="Email Address"
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
                {errors.email && <HelperText type="error">{errors.email.message}</HelperText>}

                <Controller
                    control={control}
                    rules={{
                        required: "Password is required",
                        minLength: { value: 6, message: "Password must be at least 6 characters" },
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
                                    icon={isPasswordVisible ? "eye-off" : "eye"}
                                    onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                                />
                            }
                            style={styles.input}
                            error={!!errors.password}
                        />
                    )}
                    name="password"
                />
                {errors.password && <HelperText type="error">{errors.password.message}</HelperText>}

                <View style={styles.checkboxContainer}>
                    <Checkbox
                        status={isChecked ? "checked" : "unchecked"}
                        onPress={() => setIsChecked(!isChecked)}
                        color="white"
                    />
                    <Text style={styles.checkboxText}>
                        By ticking this box, you agree to our{" "}
                        <Text style={styles.link}>Terms and conditions and private policy</Text>
                    </Text>
                </View>

                <Button
                    mode="contained"
                    onPress={handleSubmit(onSubmit)}
                    style={[
                        styles.button,
                        { backgroundColor: isChecked ? colors.primary : "grey" },
                    ]}
                    labelStyle={{ color: isChecked ? "white" : "black" }}
                    disabled={!isChecked}
                >
                    Sign Up
                </Button>

                <Text style={styles.signInText}>
                    Already have an account?{" "}
                    <Text style={styles.link} onPress={handleSignin}>
                        Sign in
                    </Text>
                </Text>
            </ScrollView>
        </LinearGradient>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    scrollView: {
        flexGrow: 1,
        justifyContent: "center",
        padding: 20,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
        color: "white",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 14,
        color: "#e0e0e0",
        marginBottom: 24,
    },
    input: {
        marginBottom: 12,
        backgroundColor: "rgb(255, 255, 255)",
    },
    checkboxContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginBottom: 24,
    },
    checkboxText: {
        flex: 1,
        marginLeft: 8,
        color: "#e0e0e0",
        fontSize: 12,
    },
    link: {
        color: "#FFD700",
    },
    button: {
        marginBottom: 16,
        paddingVertical: 8,
    },
    signInText: {
        textAlign: "center",
        color: "#e0e0e0",
    },
})

export default SignUpScreen
