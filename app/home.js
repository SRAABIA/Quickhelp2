"use client"

import { useEffect, useState } from "react"
import { View, Text, StyleSheet, Image, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native"
import { Star, Upload, User } from "lucide-react"
import { colors } from "../constants/Colors"
import { getFirestore, doc, getDoc, updateDoc } from "firebase/firestore" // Import updateDoc
import { getAuth } from "firebase/auth"
import * as ImagePicker from "expo-image-picker"
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage"

const HomePage = () => {
  const [userData, setUserData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [uploading, setUploading] = useState(false)

  const auth = getAuth()
  const db = getFirestore()
  const storage = getStorage()

  useEffect(() => {
    fetchUserData()
  }, [])

  const fetchUserData = async () => {
    try {
      const user = auth.currentUser
      if (!user) {
        setError("User not authenticated")
        setLoading(false)
        return
      }

      const userDoc = await getDoc(doc(db, "users", user.uid))
      if (!userDoc.exists()) {
        setError("User data not found")
        setLoading(false)
        return
      }

      setUserData(userDoc.data())
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUploadImage = async () => {
    try {
      setUploading(true)

      // Request permission
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        alert("Sorry, we need camera roll permissions to upload images!")
        return
      }

      // Pick the image
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      })

      if (!result.canceled) {
        const user = auth.currentUser
        const imageUri = result.assets[0].uri

        // Upload to Firebase Storage
        const response = await fetch(imageUri)
        const blob = await response.blob()
        const filename = `workImages/${user.uid}/${Date.now()}`
        const storageRef = ref(storage, filename)

        await uploadBytes(storageRef, blob)
        const downloadURL = await getDownloadURL(storageRef)

        // Update Firestore
        const userRef = doc(db, "users", user.uid)
        const currentData = await getDoc(userRef)
        const currentWorkImages = currentData.data()?.workImages || []

        await updateDoc(userRef, {
          workImages: [...currentWorkImages, downloadURL],
        })

        // Refresh user data
        fetchUserData()
      }
    } catch (err) {
      alert("Error uploading image: " + err.message)
    } finally {
      setUploading(false)
    }
  }

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={colors.primary} />
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    )
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        {userData?.profileImage ? (
          <Image source={{ uri: userData.profileImage }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.defaultAvatar]}>
            <User size={40} color={colors.primary} />
          </View>
        )}
        <View style={styles.headerInfo}>
          <Text style={styles.name}>{userData?.fullName || userData?.name}</Text>
          <Text style={styles.cnic}>{userData?.cnic}</Text>
          <View style={styles.ratingContainer}>
            {[1, 2, 3, 4, 5].map((star) => (
              <Star
                key={star}
                size={20}
                fill={star <= (userData?.rating || 0) ? colors.primary : "transparent"}
                stroke={colors.primary}
              />
            ))}
            <Text style={styles.ratingText}>{userData?.rating || 0}/5</Text>
          </View>
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Personal Details</Text>
        <View style={styles.detailsGrid}>
          <DetailItem label="Father's Name" value={userData?.fatherName} />
          <DetailItem label="Date of Birth" value={userData?.dob} />
          <DetailItem label="Gender" value={userData?.gender} />
          <DetailItem label="Country" value={userData?.country} />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Address</Text>
        <DetailItem label="Temporary" value={userData?.temporaryAddress || "Not Provided"} />
        <DetailItem label="Permanent" value={userData?.permanentAddress || "Not Provided"} />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Work Images</Text>
        <View style={styles.workImagesContainer}>
          {userData?.workImages?.map((image, index) => (
            <Image key={index} source={{ uri: image }} style={styles.workImage} />
          ))}
          <TouchableOpacity style={styles.uploadButton} onPress={handleUploadImage} disabled={uploading}>
            {uploading ? (
              <ActivityIndicator color={colors.primary} />
            ) : (
              <>
                <Upload size={24} color={colors.primary} />
                <Text style={styles.uploadText}>Upload</Text>
              </>
            )}
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  )
}

const DetailItem = ({ label, value }) => (
  <View style={styles.detailItem}>
    <Text style={styles.detailLabel}>{label}</Text>
    <Text style={styles.detailValue}>{value || "Not Provided"}</Text>
  </View>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "red",
    textAlign: "center",
  },
  header: {
    flexDirection: "row",
    padding: 20,
    backgroundColor: colors.white,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginRight: 20,
  },
  defaultAvatar: {
    backgroundColor: colors.background,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: colors.primary,
  },
  headerInfo: {
    flex: 1,
    justifyContent: "center",
  },
  name: {
    fontSize: 24,
    fontWeight: "bold",
    color: colors.textColor,
  },
  cnic: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 5,
  },
  ratingContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  ratingText: {
    marginLeft: 5,
    fontSize: 14,
    color: colors.textSecondary,
  },
  section: {
    backgroundColor: colors.white,
    margin: 10,
    padding: 15,
    borderRadius: 15,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  detailsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  detailItem: {
    width: "48%",
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 12,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    color: colors.textColor,
    fontWeight: "500",
  },
  workImagesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "flex-start",
  },
  workImage: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
  },
  uploadButton: {
    width: 100,
    height: 100,
    borderRadius: 10,
    margin: 5,
    borderWidth: 1,
    borderColor: colors.primary,
    borderStyle: "dashed",
    justifyContent: "center",
    alignItems: "center",
  },
  uploadText: {
    color: colors.primary,
    marginTop: 5,
  },
})

export default HomePage

