import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  SafeAreaView,
  StyleSheet,
  Image,
  Pressable,
} from "react-native";
import { useLocalSearchParams } from "expo-router";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig";
import CustomItemHeader from "../../components/CustomItemHeader";
import { addToCart } from "../../fireBase/fireStoreFunctions";
import { useRouter } from "expo-router";

export default function ItemDetails() {
  const { item } = useLocalSearchParams();
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [book, setBook] = useState({
    name: "",
    price: "",
    author: "",
    imageUrl: "",
    publisher: "",
    genre: "",
    // rate: 0,
  });

  useEffect(() => {
    if (!item) return;

    const fetchBookDetails = async () => {
      try {
        const docRef = doc(db, "Books", item);
        const docSnap = await getDoc(docRef);
        const data = docSnap.data();
        if (data) {
          setBook(data);
        } else {
          setError("No data found for this item.");
        }
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchBookDetails();
  }, [item]);

  const handleAddToCart = async () => {
    try {
      await addToCart(book);
    } catch (error) {
      console.error("Error adding item to cart:", error.message);
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text>Error: {error}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <CustomItemHeader router={router}  name={book.name} />
      <View style={styles.imageContainer}>
        <Image style={styles.image} source={{ uri: book.imageUrl }} />
      </View>
      <View style={styles.detailsContainer}>
        <Text style={[styles.text, { fontSize: 27 }]}>
          Book's Name: {book.name}
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Written by {book.author}
        </Text>
        {/* <Text style={[styles.text, { fontWeight: "bold" }]}>
          Rate: {book.rate} out of 5 stars
        </Text> */}
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Published by {book.publisher}
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Genre: {book.genre}
        </Text>
        <Text style={[styles.text, { fontWeight: "bold" }]}>
          Price: {book.price}{" "}
          <Text style={{ fontSize: 13, fontWeight: "500" }}>EGP</Text>
        </Text>
      </View>
      <View style={styles.buttonContainer}>
        <Pressable
          onPress={handleAddToCart}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              paddingVertical: 10,
              paddingHorizontal: 20,
              borderRadius: 20,
              alignItems: "center",
              alignSelf: "stretch",
            },
          ]}
        >
          <Text style={{ fontSize: 20, color: "#fff" }}>+ Add To Cart</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  imageContainer: {
    flex: 1,
    borderColor: "#874f1f",
    borderWidth: 8,
    marginTop:10
  },
  image: {
    flex: 1,
    resizeMode: "cover",
  },
  detailsContainer: {
    paddingHorizontal: 10,
    paddingVertical: 20,
    margin: 7,
  },
  buttonContainer: {
    alignItems: "center",
    marginBottom: 20,
  },
  text: {
    fontSize: 19,
    fontWeight: "500",
    marginBottom: 5,
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
  },
});
