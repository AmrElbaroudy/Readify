import React, { useState, useEffect } from "react";
import { getDocs, collection, addDoc , updateDoc } from "firebase/firestore";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";
import {
  StyleSheet,
  TextInput,
  FlatList,
  Alert,
  View,
  Text,
  Pressable,
} from "react-native";
import { db , auth } from "../../fireBase/Config";
import { Image } from "expo-image";
import { router } from "expo-router";

export default function home2() {
  const [books, setBooks] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkInternetConnection();
    fetchBooks();
  }, []);

  const checkInternetConnection = async () => {
    const isConnected = await NetInfo.fetch().then(
      (state) => state.isConnected
    );
    if (!isConnected) {
      Alert.alert(
        "No Internet",
        "Please check your internet connection and try again.",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }]
      );
    }
  };

  const fetchBooks = async () => {
    try {
      const querySnapshot = await getDocs(collection(db, "Books"));
      const booksData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      await AsyncStorage.setItem("books", JSON.stringify(booksData)); 
      setBooks(booksData);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching books: ", error);
      setLoading(false);
    }
  };

  const handleBookPress = (item) => {
    router.push(`ItemDetails?item=${item}`);
  };

  const addToCart = async (item) => {
    try {
      const user = auth.currentUser;
      if (!user) {
        Alert.alert("Sign In Required", "Please sign in to add items to your cart.");
        return;
      }
      
      const userId = user.uid; 
      const cartRef = collection(db, `users/${userId}/cart`);
      const cartSnapshot = await getDocs(cartRef);
      const existingCartItem = cartSnapshot.docs.find(doc => doc.data().id === item.id);
      if (existingCartItem) {
        await updateDoc(existingCartItem.ref, {
          quantity: existingCartItem.data().quantity + 1
        });
      } else {
        await addDoc(cartRef, { ...item, quantity: 1 });
      }
  
      Alert.alert("Added to Cart", `${item.name} added to your cart.`);
    } catch (error) {
      console.error("Error adding item to cart: ", error);
      Alert.alert("Error", "Failed to add item to cart.");
    }
  };
  

  const filteredBooks = books.filter((book) => {
    const name = book.name ? book.name.toLowerCase() : '';
    const publisher = book.publisher ? book.publisher.toLowerCase() : '';
    const genre = book.genre ? book.genre.toLowerCase() : '';
    const price = book.price ? book.price.toString() : '';
  
    return (
      name.includes(searchQuery.toLowerCase()) ||
      publisher.includes(searchQuery.toLowerCase()) ||
      genre.includes(searchQuery.toLowerCase()) ||
      price.includes(searchQuery)
    );
  });
  

  const sortedBooks = sortBy
    ? filteredBooks.sort((a, b) => {
        if (sortBy === "price") {
          return a[sortBy] - b[sortBy]; 
        } else if (a[sortBy] && b[sortBy]) {
          return a[sortBy].toString().localeCompare(b[sortBy].toString());
        } else {
          return 0;
        }
      })
    : filteredBooks;

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Search "
        onChangeText={(text) => setSearchQuery(text)}
        value={searchQuery}
      />
      <View style={styles.sortContainer}>
        <Text style={{ fontWeight: "bold", marginTop: 20 }}>Sort by :</Text>
        <Pressable
          onPress={() => setSortBy("name")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 8,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Name</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortBy("price")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 8,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Price</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortBy("publisher")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 8,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Publisher</Text>
        </Pressable>
        <Pressable
          onPress={() => setSortBy("genre")}
          style={({ pressed }) => [
            {
              backgroundColor: pressed ? "#874f1f" : "#ca6128",
              padding: 10,
              marginVertical: 10,
              marginHorizontal: 10,
              borderRadius: 8,
            },
          ]}
        >
          <Text style={{ color: "white" }}>Genre</Text>
        </Pressable>
      </View>
      {loading ? (
        <View style={{ justifyContent: "center", alignItems: "center" }}>
          <Text>Loading...</Text>
        </View>
      ) : (
        <FlatList
          data={sortedBooks}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleBookPress(item.id)}>
              <View style={styles.bookItem}>
                <Image
                  source={{ uri: item.imageUrl }}
                  style={styles.bookImage}
                />
                <View style={styles.bookInfoContainer}>
                  <Text style={styles.bookTitle}>{item.name}</Text>
                  <Text style={styles.bookDetails}>Author: {item.author}</Text>
                  <Text style={styles.bookDetails}>
                    Publisher: {item.publisher}
                  </Text>
                  <Text style={styles.bookDetails}>Genre: {item.genre}</Text>
                  <Text style={styles.bookDetails}>Price: {item.price}</Text>
                </View>
              </View>
            </Pressable>
          )}
          keyExtractor={(item) => item.id}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  searchInput: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 8,
  },
  sortContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginBottom: 10,
  },
  bookItem: {
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 10,
    borderRadius: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  bookImage: {
    width: 120,
    height: 190,
      borderWidth: 1,
      borderColor: "#ccc",
      paddingHorizontal: 20, 
      paddingVertical: 10, 
      borderRadius: 8, 
      flexDirection: "row",
      alignItems: "center",
      marginRight:10 
    
  },
  bookInfoContainer: {
    flex: 1,
  },
  bookTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookDetails: {
    marginBottom: 10,
  },
  addToCartButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ca6128",
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addToCartButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});
