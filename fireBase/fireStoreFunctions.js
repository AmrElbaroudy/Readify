import { db } from "./Config";
import { auth } from "./Config";
import {
  getDocs,
  doc,
  setDoc,
  addDoc,
  deleteDoc,
  updateDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";
import {
  
  Alert,
 
} from "react-native";

async function getbooks() {
  const books = collection(db, "books");
  const booksnapshot = await getDocs(books);
  const bookList = booksnapshot.docs.map((doc) => {
    return { id: doc.id, ...doc.data() };
  });
  return bookList;
}

async function editbook(book) {
  console.log("at editbook", book);
  await setDoc(doc(db, "books", book.id), book);
}

async function deletebook(id) {
  try {
    await deleteDoc(doc(db, "books", id));
    console.log("Document deleted with ID: ", id);
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}


function createUserProfile(user) {
  const userProfileRef = doc(db, "users", user.uid);
  
  setDoc(userProfileRef, {
    name: "Default Name", 
    email: user.email
  }, { merge: true })
  .then(() => {
    console.log("User profile created/updated in Firestore.");
  })
  .catch((error) => {
    console.error("Error adding/updating user profile in Firestore:", error);
  });
}

const addToCart = async (item) => {
  try {
    const user = auth.currentUser; // Get the current user
    if (!user) {
      // If user is not authenticated, prompt the user to sign in
      Alert.alert("Sign In Required", "Please sign in to add items to your cart.");
      return;
    }
    
    const userId = user.uid; 
    const cartRef = collection(db, `users/${userId}/cart`);
    
    const cartSnapshot = await getDocs(cartRef);

    // Check for existing item in the cart based on item properties
    const existingCartItem = cartSnapshot.docs.find(doc => 
      doc.data().id === item.id && doc.data().name === item.name 
    );

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


const getUserId = () => {
  const user = auth.currentUser;
  if (user) {
    const userId = user.uid;
    return userId;
  } else {
    
    return null;
  }
};

function getCart(userId) {
  const cartRef = collection(db, `users/${userId}/cart`);
  
  getDocs(cartRef)
    .then((querySnapshot) => {
      const cartItems = [];
      querySnapshot.forEach((doc) => {
        cartItems.push(doc.data());
      });
      console.log(cartItems);
      // Process/display cart items in your app
    })
    .catch((error) => {
      console.error("Error fetching cart items:", error);
    });
}

async function removeFromCart(userId, bookId) {
  try {
    const cartRef = doc(db, `users/${userId}/cart`, bookId);
    await deleteDoc(cartRef);
    console.log("Item removed from cart successfully");
  } catch (error) {
    console.error("Error removing item from cart:", error);
    throw error;
  }
}




async function addbook(book) {
  try {
    const docRef = await addDoc(collection(db, "books"), book);
    console.log("Document written with ID: ", docRef.id);
  } catch (e) {
    console.error("Error adding document: ", e);
  }
}





function subscribe(callback) {
  const unsubscribe = onSnapshot(
    query(collection(db, "books")),
    (snapshot) => {
      const source = snapshot.metadata.hasPendingWrites ? "Local" : "Server";
      snapshot.docChanges().forEach((change) => {
        // console.log("changes", change, snapshot.metadata);
        if (callback) callback({ change, snapshot });
      });
      // console.log(source, " data: ", snapshot.data());
    }
  );
  return unsubscribe;
}





export { getbooks, addbook, editbook, deletebook, subscribe, removeFromCart, addToCart, getUserId };
