import React from "react";
import { View, Text, StyleSheet, Image, ScrollView } from "react-native";
import { useSelector } from "react-redux";
import { colors } from "../constants/Colors";

const HomePage = () => {
  // Fetch user data from Redux store
  const user = useSelector((state) => state.user);
  const profileImage = useSelector((state) => state.profile.profileImage);

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Profile</Text>
      </View>

      <View style={styles.profileContainer}>
        {profileImage ? (
          <Image
            source={profileImage ? { uri: profileImage } : ""}
            style={styles.profileImage}
          />
        ) : (
          <View style={styles.placeholderImage}>
            <Text style={styles.placeholderText}>No Image</Text>
          </View>
        )}

        <Text style={styles.name}>{user.name}</Text>
        <Text style={styles.detail}>CNIC: {user.cnic}</Text>
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.sectionTitle}>Personal Details</Text>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Father's Name:</Text>
          <Text style={styles.infoValue}>{user.fatherName}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Date of Birth:</Text>
          <Text style={styles.infoValue}>{user.dob}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Gender:</Text>
          <Text style={styles.infoValue}>{user.gender}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Country:</Text>
          <Text style={styles.infoValue}>{user.country}</Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Temporary Address:</Text>
          <Text style={styles.infoValue}>
            {user.temporaryAddress || "Not Provided"}
          </Text>
        </View>

        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>Permanent Address:</Text>
          <Text style={styles.infoValue}>
            {user.permanentAddress || "Not Provided"}
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerContainer: {
    backgroundColor: colors.primary,
    padding: 20,
    alignItems: "center",
  },
  headerText: {
    color: colors.white,
    fontSize: 24,
    fontWeight: "bold",
  },
  profileContainer: {
    alignItems: "center",
    marginVertical: 20,
  },
  profileImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 2,
    borderColor: colors.primary,
  },
  placeholderImage: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
  placeholderText: {
    color: colors.textColor,
    fontSize: 14,
  },
  name: {
    fontSize: 22,
    fontWeight: "bold",
    color: colors.textColor,
    marginTop: 10,
  },
  detail: {
    fontSize: 16,
    color: "#6D6D6D",
    marginTop: 5,
  },
  infoContainer: {
    padding: 20,
    backgroundColor: "#F9F9F9",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: colors.primary,
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  infoLabel: {
    fontSize: 16,
    color: "#6D6D6D",
  },
  infoValue: {
    fontSize: 16,
    color: colors.textColor,
    fontWeight: "500",
  },
});

export default HomePage;
