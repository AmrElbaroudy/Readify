import React, { useState, useEffect } from "react";
import {
  StyleSheet,
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  Alert,
  FlatList,
  Modal,
  // ScrollView,
} from "react-native";
import { db } from "../../firebaseConfig";
import {
  addDoc,
  collection,
  getDocs,
  deleteDoc,
  doc,
  updateDoc,
} from "firebase/firestore";

export default function Admin() {
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [author, setAuthor] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  //   const [loading, setLoading] = useState(true);
  //   const [error, setError] = useState(null);
  const [publisher, setPublisher] = useState("");
  const [genre, setGenre] = useState("");
  const [selectedProduct, setSelectedProduct] = useState(null);

  const [products, setProducts] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);

  const fetchData = async () => {
    const usersRef = collection(db, "Books");

    const querySnapshot = await getDocs(usersRef);
    const productList = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
    setProducts(productList);
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDeleteProduct = async (bookId) => {
    try {
      await deleteDoc(doc(db, "Books", bookId));
      Alert.alert("Book deleted successfully");
      fetchData();
    } catch (error) {
      console.error("Error deleting book: ", error);
    }
  };

  const handleAddProduct = async () => {
    if (
      name.trim() === "" ||
      price.trim() === "" ||
      imageUrl.trim() === "" ||
      publisher.trim() === "" ||
      author.trim() === "" ||
      genre.trim() === ""
    ) {
      Alert.alert("Please enter book details");
      return;
    }

    try {
      await addDoc(collection(db, "Books"), {
        name: name,
        price: parseFloat(price),
        imageUrl: imageUrl,
        author: author,
        publisher: publisher,
        genre: genre,
      });
      Alert.alert("Book added successfully");
      setName("");
      setPrice("");
      setImageUrl("");
      setAuthor("");
      setPublisher("");
      setGenre("");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  const handleUpdateProduct = async () => {
    if (
      name.trim() === "" ||
      price.trim() === "" ||
      imageUrl.trim() === "" ||
      publisher.trim() === "" ||
      author.trim() === "" ||
      genre.trim() === ""
    ) {
      Alert.alert("Please enter book details");
      return;
    }

    try {
      const bookId = selectedProduct.id;
      await updateDoc(doc(db, "Books", bookId), {
        name: name,
        price: parseFloat(price),
        imageUrl: imageUrl,
        author: author,
        publisher: publisher,
        genre: genre,
      });
      Alert.alert("Book updated successfully");
      setName("");
      setPrice("");
      setImageUrl("");
      setAuthor("");
      setPublisher("");
      setGenre("");
      setModalVisible(false);
      fetchData();
    } catch (error) {
      console.error("Error updating book: ", error);
      Alert.alert("Error", "Failed to update book");
    }
  };

  const openEditModal = (book) => {
    setSelectedProduct(book);
    setName(book.name);
    setPrice(book.price.toString());
    setImageUrl(book.imageUrl);
    setAuthor(book.author);
    setPublisher(book.publisher);
    setGenre(book.genre);
    setModalVisible(true);
  };
  return (
    <View style={styles.container}>
      <View
        style={{ alignSelf: "flex-start", justifyContent: "space-between" }}
      >
        <TouchableOpacity
          style={styles.addButton}
          onPress={() => {
            setSelectedProduct(null);
            setName("");
            setPrice("");
            setImageUrl("");
            setAuthor("");
            setPublisher("");
            setGenre("");
            setModalVisible(true);
          }}
        >
          <Text style={styles.buttonText}>Add Product</Text>
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => {
          setModalVisible(false);
        }}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>
              {selectedProduct ? "Edit Product" : "Add Product"}
            </Text>
            {/* <View style={{ alignSelf: "stretch" }}> */}
            <TextInput
              style={styles.input}
              placeholder="Enter book name"
              value={name}
              onChangeText={setName}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter book price"
              value={price}
              onChangeText={setPrice}
              keyboardType="numeric"
            />
            {/* <ScrollView horizontal> */}
            <TextInput
              style={styles.input}
              placeholder="Enter product image URL"
              value={imageUrl}
              onChangeText={setImageUrl}
            />
            {/* </ScrollView> */}
            <TextInput
              style={styles.input}
              placeholder="Enter genre name"
              value={genre}
              onChangeText={setGenre}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter author name"
              value={author}
              onChangeText={setAuthor}
            />
            <TextInput
              style={styles.input}
              placeholder="Enter publisher name"
              value={publisher}
              onChangeText={setPublisher}
            />
            {/* </View> */}
            <TouchableOpacity
              style={styles.addButton}
              onPress={selectedProduct ? handleUpdateProduct : handleAddProduct}
            >
              <Text style={styles.buttonText}>
                {selectedProduct ? "Update Product" : "Add Product"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setSelectedProduct(null);
                setName("");
                setPrice("");
                setImageUrl("");
                setAuthor("");
                setPublisher("");
                setGenre("");
                setModalVisible(false);
              }}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <FlatList
        data={products}
        renderItem={({ item }) => (
          <View style={styles.bookItem}>
            <Image source={{ uri: item.imageUrl }} style={styles.bookImage} />
            <View style={styles.bookInfoContainer}>
              <Text style={styles.bookTitle}>{item.name}</Text>
              <Text style={styles.bookDetails}>Author: {item.author}</Text>
              <Text style={styles.bookDetails}>
                Publisher: {item.publisher}
              </Text>
              <Text style={styles.bookDetails}>Genre: {item.genre}</Text>
              <Text style={styles.bookDetails}>Price: {item.price}</Text>
              <View style={{ alignSelf: "flex-end", marginHorizontal: 10 }}>
                <TouchableOpacity
                  style={styles.deleteButton}
                  onPress={() => handleDeleteProduct(item.id)} // Pass item.id to handleDeleteProduct
                >
                  <Text style={styles.buttonText}>Delete</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.editButton}
                  onPress={() => openEditModal(item)} // Pass item to openEditModal
                >
                  <Text style={styles.buttonText}>Edit</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
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
    marginRight: 10,
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

  input: {
    height: 40,
    borderColor: "#CCCCCC",
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 10,
    marginBottom: 10,
    backgroundColor: "#FFFFFF",
    width: "100%",
  },
  addButton: {
    backgroundColor: "#874f1f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  editButton: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  deleteButton: {
    backgroundColor: "#874f1f",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "#717171",
    padding: 20,
    borderRadius: 8,
    elevation: 5,
    minWidth: 300,
    marginHorizontal: 20, // Added margin to the sides
    alignItems: "center", // Centered the content horizontally
  },

  modalTitle: {
    fontSize: 30,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#000",
  },
  cancelButton: {
    backgroundColor: "#DDDDDD",
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 18,
    marginBottom: 10,
    alignSelf: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
  },
});
