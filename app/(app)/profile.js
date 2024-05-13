import React, { useRef, useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Alert,
  TextInput,
  Modal,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import AsyncStorage from "@react-native-async-storage/async-storage";
import CustomProfileHeader from "../../components/CustomProfileHeader";
import { useRouter } from "expo-router";
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import { db } from "../../firebaseConfig";
import { auth } from "../../firebaseConfig";
import { collection, getDoc, addDoc, doc } from "firebase/firestore";
import { MaterialIcons } from "@expo/vector-icons";
const ProfilePage = () => {
  const [photo, setPhoto] = useState(null);
  const [uEmail, setUEmail] = useState("");
  const [userName, setUserName] = useState("");
  const [name, setBookName] = useState("");
  const [price, setPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [modalVisible, setModalVisible] = useState(false); // State to track modal visibility

  const router = useRouter();
  const user = auth.currentUser;
  useEffect(() => {
    fetchData();
    fetchPhoto();
  }, []);

  const fetchData = async () => {
    try {
      const userId = user.uid;
      const userDocRef = doc(db, "users", userId);
      const docSnapshot = await getDoc(userDocRef);

      if (docSnapshot.exists()) {
        const userData = docSnapshot.data();
        const userEmail = userData.email;
        const userName = userData.name;
        setUEmail(userEmail);
        setUserName(userName);
      } else {
        console.log("No such document!");
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const fetchPhoto = async () => {
    try {
      const storedPhoto = await AsyncStorage.getItem("profilePhoto");
      if (storedPhoto) {
        setPhoto(storedPhoto);
      }
    } catch (error) {
      console.error("Error fetching photo:", error);
    }
  };

  const savePhoto = async (photoUri) => {
    try {
      await AsyncStorage.setItem("profilePhoto", photoUri);
    } catch (error) {
      console.error("Error saving photo:", error.message);
    }
  };
  const handleUploadPhoto = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled) {
        setPhoto(result); // Store the entire result object in the state
        savePhoto(result.uri); // Save only the URI
      }
    } catch (error) {
      Alert.alert("Error", "Failed to upload photo.");
    }
  };

  const handleAddBook = async () => {
    try {
      const userId = user.uid;
      await addDoc(collection(db, "Books"), {
        userId,
        name,
        price,
        author,
        publisher,
        genre,
        imageUrl: photo,
      });
      // Clear input fields after adding the book
      setBookName("");
      setPrice("");
      setAuthor("");
      setPublisher("");
      setGenre("");
      setPhoto(null);
      setModalVisible(false); // Close the modal after adding the book
      Alert.alert("Success", "Book added successfully!");
    } catch (error) {
      console.error("Error adding book:", error);
      Alert.alert("Error", "Failed to add book.");
    }
  };

  return (
    <View style={styles.container}>
      <CustomProfileHeader router={router} />
      <View style={{flexDirection:'row'}}>
        <View style={{paddingTop:30, marginRight:35}}>
            <Text style={styles.uploadText}>Uploaded Photo will </Text>
            <Text style={styles.uploadText}>appear here</Text>
        </View>
          <View style={styles.photoContainer}>
            {photo ? (
              <Image source={{ uri: photo }} style={styles.photo} />
            ) : (
              <Text style={styles.uploadText}>here</Text>
            )}
          </View>
      </View>
        <Text style={styles.text}>Name: {userName}</Text>
        <Text style={styles.text}>Email: {uEmail}</Text>

      <View style={{ alignItems: "center", padding: 10, margin: 10 }}>
        <Text style={{ fontSize: 17, fontWeight: "400" }}>
          Want to sell a book please add information
        </Text>
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>Add Book</Text>
        </TouchableOpacity>
      </View>
      {/* Modal for adding a book */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(!modalVisible);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setBookName}
              placeholder="Book Name"
            />
            <TextInput
              style={styles.input}
              value={price}
              onChangeText={setPrice}
              placeholder="Price"
              keyboardType="numeric"
            />
            <TextInput
              style={styles.input}
              value={author}
              onChangeText={setAuthor}
              placeholder="Author"
            />
            <TextInput
              style={styles.input}
              value={publisher}
              onChangeText={setPublisher}
              placeholder="Publisher"
            />
            <TextInput
              style={styles.input}
              value={genre}
              onChangeText={setGenre}
              placeholder="Genre"
            />
            <TextInput
              style={styles.input}
              value={photo}
              onChangeText={setPhoto}
              placeholder="PhotoURL"
            />
            <View style={{ flexDirection: "row" }}>
              <TouchableOpacity
                style={styles.addButton}
                onPress={handleAddBook}
              >
                <Text style={styles.addButtonText}>Add Book</Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setModalVisible(false)}
                style={{ justifyContent: "center" }}
              >
                <MaterialIcons name="cancel" size={24} color="black" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingTop: 40,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
    marginBottom: "100%",
  },
  photoContainer: {
    width: 90,
    height: 90,
    borderRadius: 75,
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 30,
    borderColor: "#874f1f",
    borderWidth: 4,
  },
  photo: {
    width: 130,
    height: 130,
    borderRadius: 75,
  },
  uploadText: {
    fontSize: 16,
    color: "black",
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "black",
    // marginTop: 20,
  },
  input: {
    width: "100%",
    padding: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "gray",
    borderRadius: 5,
  },
  addButton: {
    width: "95%",

    backgroundColor: "#ca6128",
    padding: 10,
    borderRadius: 5,
  },
  addButtonText: {
    color: "white",
    fontWeight: "bold",
  },
  // Modal styles
  modalContainer: {
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    width: "100%",
    padding: 20,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
});

export default ProfilePage;
