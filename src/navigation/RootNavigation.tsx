import { NavigationContainer } from "@react-navigation/native";
import AuthNavigator from "./AuthNavigation";
import MainNavigator from "./MainNavigator";
import { useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { View, ActivityIndicator } from "react-native";
import { auth } from "../config/Firebase";
export default function RootNavigator() {

const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {

    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {

      setUser(firebaseUser);
      setLoading(false);

    });

    return unsubscribe;

  }, []);

  if (loading) {
    return (
      <View style={{flex:1,justifyContent:"center",alignItems:"center"}}>
        <ActivityIndicator size="large"/>
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? <MainNavigator/> : <AuthNavigator/>}
    </NavigationContainer>
  );
}