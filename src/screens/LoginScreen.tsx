import { StatusBar } from 'expo-status-bar';
import { useContext, useState } from 'react';
import { Image, Pressable, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { AuthContext } from '../contexts/AuthContext';

const logo = require('../../assets/OIG.png');

export default function LoginScreen() {
  const [loginOrRegister, setLoginOrRegister] = useState("login");

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <StatusBar style="auto" />
      <Image source={logo} style={{ width: 400, height: 300, marginTop: 0 }} />
      <Text style={styles.title}>DiApp</Text>

      {/* Selection between login and register */}
      <View style={{ display: 'flex', flexDirection: 'row', marginVertical: 30, justifyContent: 'center', alignItems: 'center' }}>
        <View
          style={{
            width: 150, borderBottomColor: loginOrRegister === "login" ? '#01a0aa' : '#ddd',
            padding: 5,
            borderBottomWidth: 3,
          }}
          onTouchEnd={() => setLoginOrRegister("login")}
        >
          <Text style={{ textAlign: 'center', fontSize: 18 }}>
            Login
          </Text>
        </View>
        <View style={{ height: 25, width: 0, borderLeftWidth: 1, borderLeftColor: '#ddd', marginHorizontal: 10 }} />
        <View
          style={{
            width: 150, borderBottomColor: loginOrRegister === "register" ? '#01a0aa' : '#ddd',
            padding: 5,
            borderBottomWidth: 3,
          }}
          onTouchEnd={() => setLoginOrRegister("register")}
        >
          <Text style={{ textAlign: 'center', fontSize: 18 }}>
            Register
          </Text>
        </View>
      </View>

      {loginOrRegister === "login" ? <LoginForm /> : <RegisterForm />}
    </ScrollView>
  );
}

const LoginForm = () => {
  const [email, setEmail] = useState("javier.elihu100@gmail.com");
  const [password, setPassword] = useState("123456");
  const { login } = useContext(AuthContext);

  return (
    <>
      <TextInput style={styles.textinput} placeholder="Email" keyboardType='email-address' onChangeText={setEmail} value={email} />
      <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} maxLength={20} onChangeText={setPassword} value={password} />

      <TouchableOpacity style={{ marginTop: 20, backgroundColor: '#01a0aa', padding: 10, borderRadius: 5, width: 150 }}
        onPress={() => login(email, password)}
      >
        <Text style={{ color: '#fff', fontSize: 20, textAlign: "center" }}>Login</Text>
      </TouchableOpacity>
    </>
  );
}

const RegisterForm = () => {
  const [form, setForm] = useState({
    email: "",
    name: "",
    password: "",
    confirmPassword: "",
  });

  const { signup } = useContext(AuthContext);

  const handleFormChange = (key: string, value: string) => {
    setForm({ ...form, [key]: value });
  }

  const handleRegister = () => {
    // verify form
    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    signup(form.email, form.password);
  }

  return (
    <>
      <TextInput style={styles.textinput} placeholder="Email" keyboardType='email-address' onChangeText={(text) => handleFormChange("email", text)} value={form.email} />
      <TextInput style={styles.textinput} placeholder="Name" onChangeText={(text) => handleFormChange("name", text)} value={form.name} />
      <TextInput style={styles.textinput} placeholder="Password" secureTextEntry={true} maxLength={20} onChangeText={(text) => handleFormChange("password", text)} value={form.password} />
      <TextInput style={styles.textinput} placeholder="Confirm Password" secureTextEntry={true} maxLength={20} onChangeText={(text) => handleFormChange("confirmPassword", text)} value={form.confirmPassword} />

      <TouchableOpacity
        style={{ marginTop: 20, backgroundColor: '#01a0aa', padding: 10, borderRadius: 5, width: 150 }}
        onPress={handleRegister}
      >
        <Text style={{ color: '#fff', fontSize: 20, textAlign: "center" }}>Register</Text>
      </TouchableOpacity>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    flexGrow: 1,
  },
  title: {
    color: '#000',
    fontSize: 44,
    fontWeight: 'bold',
  },
  textinput: {
    marginTop: 20,
    width: 300,
    fontSize: 20,
    borderColor: 'gray',
    borderWidth: 1,
    padding: 10,
    borderRadius: 5,
  }
});
