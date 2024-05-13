import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList , Alert } from 'react-native';
import CustomCartHeader from "../../components/CustomCartHeader";
import { useRouter } from 'expo-router';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../firebaseConfig';
import { auth } from '../../firebaseConfig';
import { getUserId, removeFromCart } from '../../fireBase/fireStoreFunctions';

export default function Cart() {
  const router = useRouter();
  const [items, setItems] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0); // State to hold the total price
  const user = auth.currentUser;

  useEffect(() => {
    if (user) {
      fetchCartItems();
    }
  }, [user]);

  useEffect(() => {
    // Recalculate total price whenever items change 
    calculateTotalPrice();
  }, [items]);

  const fetchCartItems = async () => {
    try {
      const userId = user.uid;
      const cartRef = collection(db, `users/${userId}/cart`);
      const querySnapshot = await getDocs(cartRef);
      const cartItems = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setItems(cartItems);
    } catch (error) {
      console.error("Error fetching cart items: ", error);
    }
  };

  const calculateTotalPrice = () => {
    const total = items.reduce((acc, item) => acc + (item.price * item.quantity), 0);
    setTotalPrice(total);
  };

  const handleIncrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id ? { ...item, quantity: item.quantity + 1 } : item
      )
    );
  };

  const handleDecrement = (id) => {
    setItems((prevItems) =>
      prevItems.map((item) =>
        item.id === id && item.quantity > 1 ? { ...item, quantity: item.quantity - 1 } : item
      )
    );
  };

  const handleDelete = (id) => {
   const userId = getUserId();
    removeFromCart(userId, id)
      .then(() => {
        setItems((prevItems) => prevItems.filter((item) => item.id !== id));
      })
      .catch((error) => {
        console.error("Error deleting item from cart:", error);
        Alert.alert("Error", "Failed to delete item from cart.");
      });
  };

  const renderItem = ({ item }) => (
    <View style={styles.item}>
      <View>
        <Text style={styles.itemName}>{item.name}</Text>
        <Text style={styles.itemDescription}>{item.description}</Text>
      </View>
      <View style={styles.quantityContainer}>
        <TouchableOpacity style={styles.button} onPress={() => handleDecrement(item.id)}>
          <Text style={styles.buttonText}>-</Text>
        </TouchableOpacity>
        <Text>{item.quantity}</Text>
        <TouchableOpacity style={styles.button} onPress={() => handleIncrement(item.id)}>
          <Text style={styles.buttonText}>+</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.price}>${item.price * item.quantity}</Text>
      <TouchableOpacity style={styles.deleteButton} onPress={() => handleDelete(item.id)}>
        <Text style={styles.deleteButtonText}>Delete</Text>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={styles.container}>
      <CustomCartHeader router={router}/>
      <Text style={styles.title}>CART</Text>
      <FlatList
        data={items}
        renderItem={renderItem}
        keyExtractor={(item, index) => item.id.toString() + index} // Ensure unique keys by appending index
      />
      <Text style={styles.additionalInfo}>
        *Shipping charges, taxes, and discount codes are calculated at the time of checkout.
      </Text>
      <TouchableOpacity style={styles.buyButton}>
        <Text style={styles.buyButtonText}>Buy</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
    padding: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  item: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  itemName: {
    fontWeight: 'bold',
  },
  itemDescription: {
    color: '#888',
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: 60,
  },
  button: {
    backgroundColor: '#ca6128',
    borderRadius: 5,
    padding: 5,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  price: {
    fontWeight: 'bold',
  },
  deleteButton: {
    backgroundColor: 'red',
    borderRadius: 5,
    padding: 5,
  },
  deleteButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  additionalInfo: {
    fontSize: 12,
    color: '#888',
    marginTop: 20,
  },
  buyButton: {
    backgroundColor: '#ca6128',
    borderRadius: 10,
    padding: 15,
    alignItems: 'center',
    marginTop: 20,
  },
  buyButtonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});
