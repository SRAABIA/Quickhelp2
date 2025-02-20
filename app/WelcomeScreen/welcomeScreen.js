"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, Image, StyleSheet, Dimensions, TouchableOpacity, SafeAreaView, ScrollView } from "react-native"
import { useRouter } from "expo-router" // Changed from useNavigation
import { LinearGradient } from "expo-linear-gradient"
import { colors } from "../../constants/Colors";

const { width: screenWidth, height: screenHeight } = Dimensions.get("window")

const carouselItems = [
  {
    image: require("../../assets/images/image1c.png"),
  },
  {
    image: require("../../assets/images/image2c.png"),
  },
  {
    image: require("../../assets/images/image3.png"),
  },
]

const WelcomePage = () => {
  const [activeSlide, setActiveSlide] = useState(0)
  const scrollViewRef = useRef(null)
  const router = useRouter() // Changed from navigation

  useEffect(() => {
    const interval = setInterval(() => {
      if (scrollViewRef.current) {
        const nextSlide = (activeSlide + 1) % carouselItems.length
        scrollViewRef.current.scrollTo({ x: nextSlide * screenWidth, animated: true })
        setActiveSlide(nextSlide)
      }
    }, 5000)

    return () => clearInterval(interval)
  }, [activeSlide])

  const handleScroll = (event) => {
    const slideIndex = Math.round(event.nativeEvent.contentOffset.x / screenWidth)
    setActiveSlide(slideIndex)
  }

  const handleCreateAccount = () => {
    router.push("/signup/createAccount") // Updated path to match your file structure
  }

  const handleLogin = () => {
    router.push("/phone/otp") // Assuming this is your login page pathS
  }

  const renderCarouselItem = (item, index) => (
    <View key={index} style={styles.carouselItem}>
      <Image source={item.image} style={styles.carouselImage} resizeMode="contain" />
    </View>
  )

  const renderButton = (text, bgColor, textColor, onPress) => (
    <TouchableOpacity style={[styles.button, { backgroundColor: bgColor }]} onPress={onPress}>
      <Text style={[styles.buttonText, { color: textColor }]}>{text}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.carouselContainer}>
        <ScrollView
          ref={scrollViewRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={handleScroll}
          scrollEventThrottle={200}
        >
          {carouselItems.map(renderCarouselItem)}
        </ScrollView>
        <View style={styles.paginationContainer}>
          {carouselItems.map((_, index) => (
            <View
              key={index}
              style={[
                styles.paginationDot,
                index === activeSlide ? styles.paginationActiveDot : styles.paginationInactiveDot,
              ]}
            />
          ))}
        </View>
      </View>
      <LinearGradient colors={["#007AFF", "#0051A3"]} style={styles.buttonContainer}>
        {renderButton("Login", "#FFFFFF", "#000000", handleLogin)}
        {renderButton("Create an account", colors.primary, "#FFFFFF", handleCreateAccount)}
      </LinearGradient>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  carouselContainer: {
    flex: 4, // Adjusted from 4 to 3.5
  },
  carouselItem: {
    width: screenWidth,
    alignItems: "center",
    padding: screenWidth * 0.07,
  },
  carouselImage: {
    width: screenWidth * 0.85,
    height: screenHeight * 0.3,
    resizeMode: "contain",
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    paddingVertical: 8,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
  },
  paginationActiveDot: {
    backgroundColor: "#4c669f",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  paginationInactiveDot: {
    backgroundColor: "#C4C4C4",
  },
  buttonContainer: {
    flex: 1.5, // Adjusted from 2 to 1.5
    padding: screenWidth * 0.05,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    justifyContent: "space-evenly", // Ensure buttons are equally divided
  },
  button: {
    width: "100%",
    height: screenHeight * 0.07,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "600",
  },
})

export default WelcomePage
